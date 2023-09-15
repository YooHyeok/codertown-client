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
           
            <TabPanel value={value} index={0} style={{overflow:'auto', width: 370}}>
                <SideTabAccordian/>
            </TabPanel>
            <TabPanel value={value} index={1} style={{overflow:'auto', width: 370}}>
                <SideTabAccordian/>
            </TabPanel>
            <TabPanel value={value} index={2} style={{overflow:'auto', width: 370}}>
                <SideTabAccordian/>
            </TabPanel>
            <TabPanel value={value} index={3} style={{overflow:'auto', width: 370}}>
                <SideTabAccordian/>
            </TabPanel>
            <TabPanel value={value} index={4} style={{overflow:'auto', width: 370}}>
                <SideTabAccordian/>
            </TabPanel>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderLeft: 1, borderColor: 'divider', margin: '25px 0px 0px 0px' }}
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