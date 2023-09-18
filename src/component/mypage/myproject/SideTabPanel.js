import { useState } from "react";
import { Label, Button, Table, FormGroup, InputGroup, Input, } from 'reactstrap';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';
import SideTabAccordian from './SideTabAccordian.js';

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

  export default function SideTabPanel(props) {

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
           {/* 내용 */}
           {props.projectDto.projectParts.filter((obj)=>{
                  return obj.partNo !== 1;
                }).map((obj, i)=>{
                  return(
                <TabPanel value={value} index={i} style={{overflow:'auto', width: 370}}>
                  <SideTabAccordian projectPart={obj}/>
              </TabPanel>
              )
           })}
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderLeft: 1, borderColor: 'divider', margin: '25px 0px 0px 0px' }}
            >
              {/* 사이드바 */}
              {props.projectDto.projectParts.filter((obj)=>{
                    return obj.partNo !== 1;
                  }).map((obj, i)=>{
                    return(
                      <Tab key={obj.partNo} label={<h4>{obj.partName}</h4>} {...a11yProps(i)} />
                    )
                  })
              }
            </Tabs>
        </Box>
    );
}