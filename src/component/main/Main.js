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
    , margin: '30px 0px 70px 0px'
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
    {/* <div style={{background: '#ffffff', margin:'0', padding: '0', fontFamily:'Apple SD Gothic, 맑은고딕, Nanum Gothic, sans-serif'}} >
      <div style={{background: '#ffffff', margin:'0 auto', padding: '0', width:'100%', maxWidth:'600px', boxSizing:'border-box', WebkitTextSizeAdjust:'none'}}>
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style={{background:'#fff', margin:'0', padding:'0', maxWidth:'600px'}}>
          <tbody>
            <tr>
              <td style={{background:'#ffffff',padding:'63px 2px 0'}}>
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <td align="left" style={{background:'#fff', padding:'0'}}>
                        <p style={{margin:'0 0 24px', padding:'0', fontFamily:'Apple SD Gothic, 맑은고딕, Nanum Gothic, sans-serif', fontSize:'26px', color:'#000', letterSpacing:'-1px', lineHeight:'32px', fontWeight:'bold'}}>
                          이메일 인증을 진행해주세요
                        </p>
                        <p style={{margin:'0 0 40px', padding:'0', fontFamily:'Apple SD Gothic, 맑은고딕, Nanum Gothic, sans-serif', fontSize:'18px', color:'#404040', letterSpacing:'-1px', lineHeight:'24px'}}>
                            안녕하세요. 코더타운을 이용해주셔서 감사합니다 :)<br/>
                            코더타운 가입을 위해 아래 인증번호를 화면에 입력해주세요.
                        </p>
                        <div style={{background:'#f9f9fb',border:'1px solid #ececec',borderRadius:'4px'}}>
                            <table align="center" width="100%" border="0" bgcolor="#f9f9fe" cellpadding="0" style={{border:"0"}}>
                                <tbody><tr><td height="38"></td></tr>
                                <tr>
                                  <td align="center" style={{fontFamily:'Apple SD Gothic, 맑은고딕, Nanum Gothic, sans-serif',fontSsize:'48px',color:'#202020', letterSpacing:'8px',lineHeight:'56px'}}>
                                        1768
                                  </td>
                                </tr>
                                <tr><td height="38"></td></tr>
                            </tbody></table>
                        </div>
                        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style={{border:"0"}}>
                          <tbody>
                            <tr>
                              <td align="left" style={{padding:'16px 0 0', fontFamily:'Apple SD Gothic, 맑은고딕, Nanum Gothic, sans-serif', textAlign:'center', fontSize:'16px', color:'#808080', letterSpacing:'-1px', lineHeight:'24px'}}>
                                  유효시간 5분 안에 인증하셔야 합니다.
                              </td>
                            </tr>
                            <tr><td height="56"></td></tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
      <div style={{
            width: '1200px'
          , height:"200px"
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
                <div style={{height:'200px', marginTop:'0px', backgroundColor:'lightskyblue'}}>
                  <h1 ><b>코끼리란?</b></h1>
                  <h3><b>'코' </b>딩하는 사람 <b>'끼리' </b> 모여서 함께 프로젝트를 하자는 의미를 담고있습니다. </h3>
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
                  <h1 ><b>맘모스란?</b></h1>
                  <h3><b>'맘' </b>맞는 사람 <b>'모' </b>여서  함께 <b>'스' </b>터디 하자는 의미를 담고있습니다.</h3>
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
    </div>
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