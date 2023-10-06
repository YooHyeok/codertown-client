import { useState } from "react";
import { Table } from 'reactstrap';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

  export default function TopTabAccordian(props) {
    const [expanded, setExpanded] = useState('panel1');
    const [projectParts, setProjectParts] = useState(props.projectDto.projectParts
      .filter((project)=> project.partNo !== 1));
  
    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
    const userId = useSelector( (state) => {return state.UserId} );

    /* 팀장을 제외한 참여자 리스트 총 인원수 */
    const [userProjectTotalSumState, setUserProjectTotalSumState] = useState(0)
    const userProjectTotal = (props) => {
      let userProjectTotalSum = 0;
      props.projectDto.projectParts
      .filter((project)=> project.partNo !== 1) /* 팀장 제외 */
      .forEach(element => {
        userProjectTotalSum += element.userProjectDtoList.length
      });
      setUserProjectTotalSumState(userProjectTotalSum);
    }
    useEffect(()=>{
      userProjectTotal(props);
    },[])
  
    /**
     * 프로젝트 파트 하차/추방 메서드
     * @param {*} obj 
     * @returns 
     */
    const existOrQuit = (obj, project) => {
      const isExitOrQuit = userId === obj.userDto.email ? '하차' : '추방'
      if (window.confirm('정말 '+isExitOrQuit+' 하시겠습니까?')) {
        const formData = new FormData();
        formData.append("userProjectNo", obj.userProjectNo)
        axios.post('/project/quit-exit', formData)
        .then((response)=>{
          alert(isExitOrQuit+' 완료!')
          if(isExitOrQuit == '하차') {
            document.location.href="/mypage"
            return;
          }
          /* 추방일 경우 해당 요소 제거 */
          const removeUserProjects = project.userProjectDtoList.filter(userProject => userProject !== obj);
          setProjectParts(removeUserProjects)
        })
        .catch((error)=>{
          alert(isExitOrQuit+' 실패!')
        })
        return;
      }
    }

    return (
      <div>
        <h4>팀장</h4>
        <Table bordered>
                <tbody>
                  {props.projectDto.projectParts
                        .filter((project)=> project.partNo === 1)
                        .map((project) => {
                          return (
                            project.userProjectDtoList.map((obj)=>{
                              return (
                                <tr key={obj.userProjectNo}>
                                  <td>
                                  <img style={{width:'25px', height:'25px', margin:'0px', borderRadius:'50%', float:"left"}} className="profile" src={'/default_profile.png'} alt="profile"/>
                                  <span style={{width:"120px", float:"left"}}>{obj.userDto.nickname}</span>
                                  </td>
                                </tr>
                              );
                            })
                          )
                        })}
                </tbody>
            </Table>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
            <Typography><h4>전체 인원 현황</h4></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
            <Table bordered>
                <thead>
                    <tr>
                        <th>파트</th>
                        <th>모집인원</th>
                        <th>지원인원</th>
                        <th>남은자리</th>
                    </tr>
                </thead>
                <tbody>
                  {projectParts.filter((obj)=>{
                    return obj.partNo !== 1;
                  }).map((obj)=>{
                      return (
                        <tr key={obj.partNo}>
                          <td>{obj.partName}</td>
                          <td>{obj.recruitCount}</td>
                          <td>{obj.currentCount}</td>
                          <td>{obj.recruitCount-obj.currentCount}</td>
                      </tr>
                      )
                    })}
                </tbody>
            </Table>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2d-content" id="panel2d-header">
            <Typography><h4>참여자 전체 리스트</h4></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
            <Table bordered >
                    <thead>
                        <tr>
                            <th>파트</th>
                            <th>참여자</th>
                        </tr>
                    </thead>
                    <tbody>
                      {userProjectTotalSumState === 0 && 
                      <tr>
                        <td colSpan={2}>
                          참여자가 없습니다.
                        </td>
                      </tr>
                      }
                        {userProjectTotalSumState !== 0 && 
                        projectParts
                        .filter((project)=> project.partNo !== 1)
                        .map((project) => {
                          return (
                            project.userProjectDtoList.map((obj)=>{
                              return (
                                <tr key={obj.userProjectNo}>
                                  <td>{project.partName}</td>
                                  <td>
                                  <img style={{width:'25px', height:'25px', margin:'0px', borderRadius:'50%', float:"left"}} className="profile" src={'/default_profile.png'} alt="profile"/>
                                  <span style={{width:"120px", float:"left"}}>{obj.userDto.nickname}</span>
                                  <button style={{display:"block", float:"right"}}
                                  onClick={()=>existOrQuit(obj, project)}> {userId === obj.userDto.email ? '하차' : '추방'}</button>
                                  </td>
                                </tr>
                              );
                            })
                          )
                        })}
                    </tbody>
                </Table>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }