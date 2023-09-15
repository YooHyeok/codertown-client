import { useState } from "react";
import { Table } from 'reactstrap';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { /* MUI - Accordion */
        Tabs, Tab, Box, AppBar /* MUI - Tabs */
        , Typography, useTheme} from '@mui/material';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));
  
  export default function TopTabAccordian() {
    const [expanded, setExpanded] = useState('panel1');
  
    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
  
    return (
      <div>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography><h3>프로젝트 총 인원 현황</h3></Typography>
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
                    <tr>
                        <td>PM/기획</td>
                        <td>3</td>
                        <td>1</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>디자이너</td>
                        <td>3</td>
                        <td>1</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>퍼블리셔</td>
                        <td>3</td>
                        <td>1</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>프론트엔드</td>
                        <td>3</td>
                        <td>1</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>백엔드</td>
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
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography><h3>프로젝트 참여자 전체 리스트</h3></Typography>
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
                        <tr>
                            <td>PM/기획</td>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임1</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td>디자이너</td>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임2</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td>퍼블리셔</td>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임3</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td>프론트엔드</td>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임2</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td>백엔드</td>
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