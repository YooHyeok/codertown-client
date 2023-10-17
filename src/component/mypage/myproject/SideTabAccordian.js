import { useState } from "react";
import { Table } from 'reactstrap';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useSelector } from "react-redux";
import axios from "axios";
import useToast from "../../../hook/useToast";
  export default function SideTabAccordian(props) {
    const [expanded, setExpanded] = useState('panel1');
    const userId = useSelector( (state) => {return state.UserId} );

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
    const [userProjectList, setUserProjectList] = useState(props.projectPart.userProjectDtoList)
    const {toastAlertSuccess, toastAlertError} = useToast();
  /**
   * 프로젝트 파트 하차/추방 메서드
   * @param {*} obj 
   * @returns 
   */
  const existOrQuit = (obj) => {
    const isExitOrQuit = userId === obj.userDto.email ? '하차' : '추방'
    if (window.confirm('정말 '+isExitOrQuit+' 하시겠습니까?')) {
      const formData = new FormData();
      formData.append("userProjectNo", obj.userProjectNo)
      axios.post('/project/quit-exit', formData)
      .then((response)=>{
        toastAlertSuccess(isExitOrQuit+' 완료!')
        if(isExitOrQuit == '하차') {
          document.location.href="/mypage" //추후 데이터를 다시뿌리는 형태로 가야할것을 고려해봐야함.
          return;
        }
        /* 추방일 경우 해당 요소 제거 */
        const removeUserProjects = userProjectList.filter(userProject => userProject !== obj);
        setUserProjectList(removeUserProjects)
        props.joinProjectDetail();
      })
      .catch((error)=>{
        toastAlertError(isExitOrQuit+' 실패!')
      })
      return;
    }
  }

    return (
      <div>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
            <Typography><h4>인원 현황</h4></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
                <Table bordered>
                        <thead>
                            <tr>
                                <th>모집인원</th>
                                <th>지원인원</th>
                                <th>지원가능</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr key={props.projectPart.partNo}>
                                  <td>{props.projectPart.recruitCount}</td>
                                  <td>{props.projectPart.currentCount}</td>
                                  <td>{props.projectPart.recruitCount-props.projectPart.currentCount}</td>
                              </tr>
                        </tbody>
                    </Table>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2d-content" id="panel2d-header">
            <Typography><h4>참여자 리스트</h4></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
            <Table bordered>
                    <thead>
                        <tr>
                            <th>참여자</th>
                        </tr>
                    </thead>
                    <tbody>
                      {userProjectList.length > 0 && userProjectList.map((obj)=>{
                        return (
                          
                          <tr key={obj.userProjectNo}>
                            <td>
                            <img style={{width:'25px', height:'25px', margin:'0px', borderRadius:'50%', float:"left"}} className="profile" src={`data:image/png;base64,${obj.userDto.profileUrl}`}/>
                            <span style={{width:"120px", float:"left"}}>{obj.userDto.nickname}</span>
                            {props.myPartNo !== 1 && userId === obj.userDto.email?
                                <button style={{display:"block", float:"right"}}
                                onClick={()=>existOrQuit(obj)}> {'하차'}</button>
                                : null
                                }
                                {props.myPartNo === 1 ?
                                <button style={{display:"block", float:"right"}}
                                onClick={()=>existOrQuit(obj)}> {'추방'}</button>
                                : null
                                }     
                          </td>
                        </tr>
                        );
                      })}
                      {userProjectList.length <= 0 &&
                          <tr key={0}>
                            <td>
                              참여자가 없습니다.
                          </td>
                        </tr>
                      }
                    </tbody>
                </Table>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }