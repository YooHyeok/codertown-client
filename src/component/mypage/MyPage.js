// import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import './MyPage.css';
import MyInfoEdit from './MyInfoEdit';
import MyProject from './myproject/MyProject';
import MyPost from './mypost/MyPost';

export default function MyPage() {

    // Tab
    const [tabChange, setTabChange] = useState({activeTab:'1'});

    const tabToggle = (tab) => {
        if (tabChange.activeTab !== tab) {
            setTabChange({activeTab: tab})
            localStorage.setItem('activeTab', tab); //탭 변경시 로컬 스토리지에 선택된 탭값으로 초기화
        }
    }
    
    useEffect(() => {
        setTabChange({activeTab: localStorage.getItem('activeTab')});
      }, [])

    /**
     * JSX 시작
     */
    return <div style={bodyStyle} >
                <div><h1><b> My Page</b></h1></div><br />
                {/* ============== 탭 네비 영역 ============== */}
                <Nav style={navStyle} tabs >
                    <NavItem style={{ height:"50px"}}>
                        <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '1' })} onClick={() => { tabToggle('1'); }} >
                            <span style={tabStyle} >프로필</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '2' })} onClick={() => { tabToggle('2'); }}>
                            <span style={tabStyle} >프로젝트</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '3' })} onClick={() => { tabToggle('3'); }}>
                            <span style={tabStyle} >게시글</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '4' })} onClick={() => { tabToggle('4'); }}>
                            <span style={tabStyle} >북마크</span>
                        </NavLink>
                    </NavItem>
                </Nav>
                {/* ============== 탭 컨텐츠 영역 ============== */}
                <TabContent activeTab={tabChange.activeTab}>
                        <TabPane tabId="1">
                            {/* 내정보 수정 */}
                            {tabChange.activeTab === '1' && <MyInfoEdit/>}
                        </TabPane>
                        <TabPane tabId="2">
                            {/* 나의 프로젝트 */}
                            {tabChange.activeTab === '2' && <MyProject/>}
                        </TabPane>
                        <TabPane tabId="3">
                            {/* 나의 게시글 */}
                            {tabChange.activeTab === '3' && <MyPost tabType={'myPost'}/>}
                        </TabPane>
                        <TabPane tabId="4">
                            {/* 나의 북마크 */}
                            {tabChange.activeTab === '4' && <MyPost tabType={'myBookMark'}/>}
                        </TabPane>
                    </TabContent>
            </div >
    
}

/**
 * 바디영역 CSS
 */
const bodyStyle = {
    width: '1200px'
    , height: '750px'
    , textAlign: 'center'
    , margin: '80px auto'
    , marginBottom: '74px'
    , padding: '30px'
    , top: '100'
};

/**
 * 네비영역 CSS
 */
const navStyle = {
    width:"500px"
    , margin:"10px auto"
    , height:"50px"
    , borderBottom:"3px solid black"
};

const tabStyle = {
    position: 'relative'
    , display: 'block'
    , height: "20px"
    , top:"-20px"
    , userSelect:"none"
};