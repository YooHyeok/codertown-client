import { useState, useEffect } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';
import AllCardList from './AllCardList';
import CokkiriCardList from './CokkiriCardList';
import MammothCardList from './MammothCardList';
import './Main.css';

export default function Main() {

  // Tab <Nav> 영역 Style CSS
  const navStyle = {
    width: '350px'
    , height: '100%'
    , textAlign: 'left'
    , margin: '120px 0px 70px 0px'
    , top: '100'
  };

  // Tab <TabContent> 영역 Style CSS
  const tabStyle = {
    width: '1200px'
  , minHeight: '1200px'
  , height:"100%"
  , textAlign: 'left'
  , margin: '-50px auto'
  };

  // Tab
  const [tabChange, setTabChange] = useState({activeTab:'1'});

  const tabToggle = (tab) => {
      console.log(tab)
      if (tabChange.activeTab !== tab) {
          setTabChange({activeTab: tab})
      }
  }

  return (
  <div className="body">
    {/* ============== 탭 네비 영역 ============== */}
    <div style={navStyle} >
            <Nav className="custom-nav" style={{position:"relative", width: "350px", height:"40px", top:"10px"}} pills>
              <NavItem>
                  <NavLink style={{ height:"30px"}} className={classnames({ active: tabChange.activeTab === '1' })} onClick={() => { tabToggle('1'); }} >
                    <span style={{position: 'relative', top:"-34px", userSelect:"none" }} >전체</span>
                  </NavLink>
              </NavItem>
              <NavItem>
                  <NavLink style={{ height:"30px"}} className={classnames({ active: tabChange.activeTab === '2' })} onClick={() => { tabToggle('2'); }}>
                    <span style={{position: 'relative', top:"-34px", userSelect:"none" }} >코끼리</span>
                  </NavLink>
              </NavItem>
              <NavItem>
                  <NavLink style={{ height:"30px"}} className={classnames({ active: tabChange.activeTab === '3' })} onClick={() => { tabToggle('3'); }}>
                    <span style={{position: 'relative', top:"-34px", userSelect:"none"}} >맘모스</span>
                  </NavLink>
              </NavItem>
            </Nav>
      </div>
      {/* ============== 탭 컨텐츠 영역 ============== */}
      <div style={tabStyle}>
        <TabContent activeTab={tabChange.activeTab}>

            <TabPane tabId="1">
              {/* Recruit 전체 리스트 */}
              <AllCardList/>
            </TabPane>

            <TabPane tabId="2">
              {/* Recruit 코끼리 리스트 */}
              <CokkiriCardList/>
            </TabPane>

            <TabPane tabId="3">
              {/* Recruit 맘모스 리스트 */}
              <MammothCardList/>
            </TabPane>
        </TabContent>
        </div>
    </div>
  )}