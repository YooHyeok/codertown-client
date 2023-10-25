import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';
import SideTabAccordian from './SideTabAccordian.js';
import axios from "axios";

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

  const [projectPartList, setProjectPartList] = useState([])

  useEffect(()=>{
    joinProjectDetail();
  }, [])

  const joinProjectDetail = () => {
    const formData = new FormData();
    formData.append("projectNo", props.projectNo)
    axios.post("/joined-project-detail", formData)
    .then((response)=>{
      setProjectPartList(response.data.projectPartList)
    })
    .catch((error)=>{
    })
  }
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
          {projectPartList.filter((obj)=>{
                return obj.partNo !== 1;
              }).map((obj, i)=>{
                return(
              <TabPanel key={i} value={value} index={i} style={{overflow:'auto', width: 370}}>
                <SideTabAccordian projectPart={obj} joinProjectDetail={joinProjectDetail} myPartNo={props.myPartNo} />
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
            {projectPartList.filter((obj)=>{
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