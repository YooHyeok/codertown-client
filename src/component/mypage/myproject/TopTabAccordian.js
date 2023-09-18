import { useState } from "react";
import { Table } from 'reactstrap';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

  export default function TopTabAccordian(props) {
    const [expanded, setExpanded] = useState('panel1');
  
    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
  
    return (
      <div>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
            <Typography><h4>프로젝트 총 인원 현황</h4></Typography>
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
                  {props.projectDto.projectParts.filter((obj)=>{
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
            <Typography><h4>프로젝트 참여자 전체 리스트</h4></Typography>
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
                        {props.projectDto.projectParts.map((project) => {
                          return(
                            project.userProjectDtoList.map((obj)=>{
                              return (
                                <tr key={obj.userProjectNo}>
                                  <td>{project.partName}</td>
                                  <td>
                                  <img style={{width:'25px', height:'25px', margin:'0px', borderRadius:'50%', float:"left"}} className="profile" src={'/default_profile3.png'} alt="profile"/>
                                  <span style={{width:"120px", float:"left"}}>{obj.userDto.nickname}</span>
                                  <button style={{display:"block", float:"right"}}>추방</button>
                                </td>
                              </tr>
                              );
                            })
                        )})}
                    </tbody>
                </Table>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }