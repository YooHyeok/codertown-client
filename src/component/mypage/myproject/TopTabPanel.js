import { useState } from "react";
import { Label, Button, Table, FormGroup, InputGroup, Input, } from 'reactstrap';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box, AppBar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';//npm install --save react-swipeable-views --force
import SideTabPanel from './SideTabPanel.js';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }
 
export default function TopTabPanel() {

    const theme = useTheme();
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setValue(index);
    };
  
    return (
      <Box sx={{ bgcolor: 'background.paper', width: 500 }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label={<h5>{'전체 현황'}</h5>} {...a11yProps(0)} />
            <Tab label={<h5>{'파트별 현황'}</h5>} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction} style={{overflow:'auto', height:465}}>
          <h3>프로젝트 총 인원 현황</h3>
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
            <h3>프로젝트 참여자 전체 리스트</h3>
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
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction} style={{height:465}}>
            <SideTabPanel/>
          </TabPanel>
            
        </SwipeableViews>
        
      </Box>
    );
}