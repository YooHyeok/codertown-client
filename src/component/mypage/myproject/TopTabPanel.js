import { useState } from "react";
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
/* MUI - Accordion */
import { ArrowForwardIosSharpIcon } from '@mui/icons-material/ArrowForwardIosSharp';
import { MuiAccordion, MuiAccordionSummary, MuiAccordionDetails /* MUI - Accordion */
        , Tabs, Tab, Box, AppBar /* MUI - Tabs */
        , Typography, useTheme} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';//npm install --save react-swipeable-views --force
import SideTabPanel from './SideTabPanel.js';
import TopTabAccordian from './TopTabAccordian.js';


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
            style={{backgroundColor:'lightgray'}}
          >
            <Tab style={{backgroundColor:'#6C757D'}} label={<h5>{'전체 현황'}</h5>} {...a11yProps(0)} />
            <Tab style={{backgroundColor:'#6C757D'}} label={<h5>{'파트별 현황'}</h5>} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction} style={{overflow:'auto', height:465}}>
            {/* 전체 현황 Accordian컴포넌트 */}
            <TopTabAccordian/>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction} style={{height:465}}>
            {/* 파트별 현황 SpdePanel컴포넌트 */}
            <SideTabPanel/>
          </TabPanel>
            
        </SwipeableViews>
        
      </Box>
    );
}