import { useState } from "react";
import { Table } from 'reactstrap';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

  export default function SideTabAccordian() {
    const [expanded, setExpanded] = useState('panel1');
  
    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
  
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
                            <tr>
                                <td>3</td>
                                <td>1</td>
                                <td>2</td>
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
                            <th>이름</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임1</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임2</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임3</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                    </tbody>
                </Table>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }