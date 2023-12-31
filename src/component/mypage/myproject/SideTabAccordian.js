import { useState } from "react";
import { Table } from 'reactstrap';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useSelector } from "react-redux";
import axios from "axios";
import useToast from "../../../hook/useToast";
import { confirmAlert } from "react-confirm-alert"; // npm install react-confirm-alert --save --force
import { Navigate } from "react-router-dom";

  export default function SideTabAccordian(props) {
    const [expanded, setExpanded] = useState('panel1');
    const userId = useSelector( (state) => {return state.UserId} );
    const [render, setRender] = useState(false);
    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
    const {toastAlertSuccess, toastAlertError} = useToast();
  /**
   * 프로젝트 파트 하차/추방 메서드
   * @param {*} obj 
   * @returns 
   */
  const existOrQuit = (obj) => {
    const isExitOrQuit = userId === obj.userDto.email ? '하차' : '추방'
    confirmAlert({
      title: '프로젝트 '+ isExitOrQuit +' 확인',
      message: '정말 '+isExitOrQuit+' 하시겠습니까?',
      buttons: [
        {
          label: "확인",
          onClick: () => {
            const formData = new FormData();
            formData.append("userProjectNo", obj.userProjectNo)
            axios.post('/project/quit-exit', formData)
            .then((response)=>{
              toastAlertSuccess(isExitOrQuit+' 완료!')
              if(isExitOrQuit == '하차') {
                props.joinProjectDetail();
                return;
              }
            })
            .catch((error)=>{
              toastAlertError(isExitOrQuit+' 실패!')
            })
          },
        },
        {
          label: "취소",
          onClick: () => { },
        },
      ],
    });

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
                            <th style={{width:'85px', textAlign:'center'}}>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                      {props.projectPart.userProjectDtoList.length > 0 && props.projectPart.userProjectDtoList.map((obj)=>{
                        return (
                          
                          <tr key={obj.userProjectNo} >
                            <td style={{padding:'0.3rem 0.4rem'}}>
                            <img style={{width:'25px', height:'25px', margin:'0px', borderRadius:'50%', float:"left"}} className="profile" src={`data:image/png;base64,${obj.userDto.profileUrl}`}/>
                            <span style={{width:"120px", fontSize:'17px', float:"left"}}>{obj.userDto.nickname}</span>
                             
                          </td>
                          <td style={{padding:'0.3rem 0.3rem', textAlign:'center'}}>
                                <span style={{fontSize:'17px'}}>{obj.personalStatus === 'JOIN' ? '참여' : obj.personalStatus === 'END' ? '종료': '하차'}</span>
                                
                                {obj.personalStatus === 'JOIN' &&
                                <>
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
                                </>
                                }
                          </td>
                        </tr>
                        );
                      })}
                      {props.projectPart.userProjectDtoList.length === 0 &&
                          <tr key={0} >
                            <td colSpan={2}>
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