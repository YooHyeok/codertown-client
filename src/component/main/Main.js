import { useState, useEffect } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import Slider from "react-slick"; //npm install react-slick --save --force

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
    , margin: '140px 0px -10px 0px'
    , top: '100'
  };

  // Tab <TabContent> 영역 Style CSS
  const tabStyle = {
    width: '1200px'
  , height:"100%"
  , minHeight: '620px'
  , textAlign: 'left'
  , margin: '50px auto'
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
      {/* <div style={{
            width: '1200px'
          , height:"250px"
          // , textAlign: 'left'
          , marginTop: '100px'
          }} >
      <Slider {...{dots: true,infinite: true,speed: 500,slidesToShow: 1,slidesToScroll: 1, accessibility:true, arrows:true}}>
        <div style={{
                width: '1200px'
              , height:"200px !important"
              // , textAlign: 'left'
              // , margin: '100px auto'
              }} >
                <div style={{height:'250px', backgroundColor:'lightskyblue'}}>
                  <div style={{width:'1200px', textAlign: 'left'}}>
                    <h1 ><b>코끼리란?</b></h1> <br/>
                  </div>
                  <h3><b>'코' </b>딩하는 사람 <b>'끼리' </b> 모여서 함께 프로젝트를 하자는 뜻을 내포하고 있습니다. </h3>
                  <br/>
                  <h4>코끼리 게시판에 구인 게시글을 작성하여 프로젝트 주제, 목표 기간, 파트 등을 상세히 작성할 수 있습니다.</h4>
                  <h4>게시판에 포스팅된 게시글들을 통해 원하는 파트를 선택하여 팀원 신청을 할 수 있습니다!</h4>
                </div>
        </div>
        <div style={{
                width: '1200px'
              , height:"200px !important"
              // , textAlign: 'left'
              // , margin: '100px auto'
              }} >
                <div style={{height:'200px', marginTop:'0px', backgroundColor:'lightgoldenrodyellow'}}>
                    <h1><b>맘모스란?</b></h1>
                  <h3><b>'맘' </b>맞는 사람 <b>'모' </b>여서  함께 <b>'스' </b>터디 하자는 뜻을 내포하고 있습니다.</h3>
                  <h4>맘모스 게시판에 구인 게시글을 작성하여 공부할 내용, 지역, 채팅방링크 등을 상세히 작성할 수 있습니다.</h4>
                  <h4>게시판에 포스팅된 게시글들을 통해 원하는 공부, 지역을 검색하는 등 참여하고자 하는 스터디를 검색할 수 있습니다!</h4>
                </div>
        </div>
        <div style={{
                width: '1200px'
              , height:"200px !important"
              // , textAlign: 'left'
              // , margin: '100px auto'
              }} >
                <div style={{height:'200px', marginTop:'0px', backgroundColor:'lightgrey'}}>
                  <h1 ><b>코글은?</b></h1>
                  <h3>{'<'}<b>TechQue</b> 기술 질문{'> <'}<b>Carrier</b> 개발자 커리어{'> <'}<b>Devlife</b> 개발일상{'>'}</h3>
                  <h4>세가지 주제로 글을 작성하고, 자유롭게 댓글을 주고받으며 소통하는 개발자를 위한 커뮤니티 게시판입니다.</h4>
                  <h4>코더타운은 회원간 매너있는 소통을 지향합니다.</h4>
                </div>
        </div>


    </Slider>
    </div> */}
    <div style={navStyle} >
            <Nav className="custom-nav" style={{position:"relative", width: "350px", height:"40px", top:"10px"}} pills>
              <NavItem style={{height:'40px'}}>
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
              {tabChange.activeTab === '2' && <CokkiriCardList/>}
              
            </TabPane>

            <TabPane tabId="3">
              {/* Recruit 맘모스 리스트 */}
              <MammothCardList/>
            </TabPane>
        </TabContent>
        </div>
    </div>
  )}