import { useState } from "react";
import { Label, Button, Table, FormGroup, InputGroup, Input, } from 'reactstrap';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 5 }}>
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
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  export default function SideTabPanel() {

    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleChangeIndex = (index) => {
      setValue(index);
    };
  
    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                height:'465px'
            }}
            >
           
            <TabPanel value={value} index={0} style={{overflow:'auto', height:'464px'}}>
            <h3>PM/기획 인원 현황</h3>
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
                <h3>PM/기획 참여자 리스트</h3>
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
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임1</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임2</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임3</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임1</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임2</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
                        <tr>
                            <td><p style={{width:"100px", float:"left"}}>[프로필 영역]</p><p style={{width:"120px", float:"left"}}>참여자닉네임3</p> <button style={{display:"block", float:"right"}}>추방</button></td>
                        </tr>
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
            </TabPanel>
            <TabPanel value={value} index={1} style={{overflow:'auto'}}>
            <h3>디자이너 인원 현황</h3>
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
                <h3>디자이너 참여자 리스트</h3>
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
            </TabPanel>
            <TabPanel value={value} index={2} style={{overflow:'auto'}}>
            <h3>퍼블리셔 인원 현황</h3>
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
                <h3>퍼블리셔 참여자 리스트</h3>
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
            </TabPanel>
            <TabPanel value={value} index={3} style={{overflow:'auto'}}>
            <h3>프론트엔드 인원 현황</h3>
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
                <h3>프론트엔드 참여자 리스트</h3>
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
            </TabPanel>
            <TabPanel value={value} index={4} style={{overflow:'auto'}}>
            <h3>백엔드 인원 현황</h3>
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
                <h3>백엔드 참여자 리스트</h3>
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
            </TabPanel>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderLeft: 1, borderColor: 'divider', margin: '30px auto' }}
            >
                <Tab label={<h4>{'PM/기획'}</h4>} {...a11yProps(0)} />
                <Tab label={<h4>{'디자이너'}</h4>} {...a11yProps(1)} />
                <Tab label={<h4>{'퍼블리셔'}</h4>} {...a11yProps(2)} />
                <Tab label={<h4>{'프론트엔드'}</h4>} {...a11yProps(3)} />
                <Tab label={<h4>{'백엔드'}</h4>} {...a11yProps(4)} />
            </Tabs>
        </Box>
    );
}