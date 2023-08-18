// import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Form, Label, Input, Button, Col, FormGroup, TabContent, TabPane, Nav, NavItem, NavLink, Table, Row} from 'reactstrap';
import { BsFillSuitHeartFill } from "react-icons/bs"
import classnames from 'classnames';
import './MyPage.css';
import MyInfoEdit from './MyInfoEdit';


export default function MyPage() {
    const divStyle = {
        width: '1200px'
        , height: '730px'
        , textAlign: 'center'
        , margin: '100px auto'
        , marginBottom: '74px'
        , padding: '30px'
        , top: '100'
    };
    const selectRef = useRef(null);


    // Tab
    const [tabChange, setTabChange] = useState({activeTab:'1'});

    const tabToggle = (tab) => {
        console.log(tab)
        if (tabChange.activeTab !== tab) {
            setTabChange({activeTab: tab})
        }
    }



    const [coggleList , setCoggleList] = useState([])
    const [pageInfo, setPageInfo] = useState({
        allPage: 10, curPage: 1, startPage: 1, endPage: 10
      });

    const pageRequest = (e) => {
    console.log("e.target.value : " + e.target.value);
    }
    useEffect(() => {
        /* coggleList 목데이터 */
        const mockCoggleList = [];
        for (let j = 0; j < 10; j++) {
            mockCoggleList.push({coggleNo:j, title: '제목'+j, writer: '작성자'+j, firstRegDate:"2023-08-14", like: j, count: j});
        }
        setCoggleList(mockCoggleList)
      }, [])


    return <div style={divStyle} >
                <div><h1><b> My Page</b></h1></div><br />
        {/* ============== 탭 네비 영역 ============== */}
                <div className="screen-wrap">
                    <div style={{width:"500px", margin:"0 auto"}}>
                        <Nav style={{height:"50px", borderBottom:"2px solid black"}} tabs >
                        <NavItem style={{height:"50px"}}>
                            <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '1' })} onClick={() => { tabToggle('1'); }} >
                            <span style={{position: 'relative', top:"-20px", userSelect:"none"}} >내정보 수정</span>
                            </NavLink>
                        </NavItem>
                        <NavItem style={{height:"50px"}}>
                            <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '2' })} onClick={() => { tabToggle('2'); }}>
                            <span style={{position: 'relative', top:"-20px", userSelect:"none"}} >나의 프로젝트</span>
                            </NavLink>
                        </NavItem>
                        <NavItem style={{height:"50px"}}>
                            <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '3' })} onClick={() => { tabToggle('3'); }}>
                            <span style={{position: 'relative', top:"-20px", userSelect:"none"}} >나의 게시글</span>
                            </NavLink>
                        </NavItem>
                        </Nav>
                        
                    </div>
                </div>
        {/* ============== 탭 컨텐츠 영역 ============== */}
                <TabContent activeTab={tabChange.activeTab}>
                        <TabPane tabId="1">
                                {/* 내정보 수정 시작 */}
                                <MyInfoEdit/>
                        </TabPane>

                        <TabPane tabId="2">
                            <Row>
                            <Col>
                            <div style={{borderTop: '0.1px solid lightgray', margin:"30px auto"}}>
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>프로젝트</th>
                                            <th>파트</th>
                                            <th>시작일</th>
                                            <th>종료(예정)</th>
                                            <th>전체 상태</th>
                                            <th>개인 상태</th>
                                            <th>파트 정보</th>
                                        </tr>
                                    </thead>
                                    {console.log(coggleList)}

                                    <tbody style={{overflow:"auto"}}>
                                        {/* {this.repeatTrTd()} */}
                                        {coggleList.map((obj) => {
                                            console.log(obj);
                                            return (
                                                <tr key={obj.coggleNo}>
                                                <td>{obj.coggleNo}</td>
                                                <td>{obj.title}</td>
                                                <td>{obj.writer}</td>
                                                <td>{obj.firstRegDate}</td>
                                                <td>{obj.firstRegDate}</td>
                                                <td>
                                                <select ref={selectRef} name="" id="statusSelect" value={{}} onChange={(e)=>{e.preventDefault();}}
                                                    style={{display:"inline", width:"50px", paddingRight:"-20px", lineHeight:"normal", height:"20px", fontSize:"15px", border:"none", outline:"none"}}>
                                                    <option value={"RECRUIT"}>모집</option>
                                                    <option value={"RUN"}>진행</option>
                                                    <option value={"FAIL"}>무산</option>
                                                    <option value={"CLOSED"}>완료</option>
                                                </select>
                                                </td>
                                                <td>{obj.count}</td>
                                                <td>
                                                    <Button color='secondary' style={{ width: '70px', padding:"0.5em", height:"20px" }} onClick={(e)=>{e.preventDefault();}}>
                                                        <span style={{position:"relative", height:"20px", top:"-10px", fontSize:"15px"}}>정보 보기</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                            )
                                        })}
                                    </tbody>
                                    {/* map은 각각의 요소마다 return한다. */}
                                </Table>
                            </div>
                            <div style={{marginTop:"50px", textAlign:"center"}}>
                                {(() => {
                                    const array = [];
                                    for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
                                        if (i == pageInfo.curPage) {
                                        array.push(
                                            <span key={i}><Button style={{border:"none"}} color='secondary' className='numberbutton' value={i} onClick={pageRequest}>{i}</Button>&nbsp;&nbsp;</span>
                                        )
                                        } else {
                                        array.push(
                                            <span key={i}><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={i} onClick={pageRequest}>{i}</Button>&nbsp;&nbsp;</span>
                                        )
                                        }
                                    }
                                    if(pageInfo.curPage != 1)
                                    array.unshift(
                                        <span ><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage-1} onClick={pageRequest}>{"<"}</Button>&nbsp;&nbsp;</span>

                                    )
                                    if(pageInfo.curPage != Math.max(pageInfo.allPage))
                                    array.push(
                                        <span ><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage+1} onClick={pageRequest}>{">"}</Button>&nbsp;&nbsp;</span>

                                    )
                                    return array;
                                    })()}
                            </div>
                            </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="3">
                            <Row>
                            <Col>
                                <div style={{borderTop: '0.1px solid lightgray', margin:"30px auto"}}>
                                    <Table >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>카테고리</th>
                                                <th>제목</th>
                                                <th>작성일자</th>
                                                <th>수정일자</th>
                                                <th>
                                                    <BsFillSuitHeartFill style={{width:"20px",height:"20px",margin:"0 auto"}}/>
                                                </th>
                                                <th>
                                                    조회수                                            
                                                </th>
                                            </tr>
                                        </thead>
                                        {console.log(coggleList)}

                                        <tbody style={{overflow:"auto"}}>
                                            {/* {this.repeatTrTd()} */}
                                            {coggleList.map((obj) => {
                                                console.log(obj);
                                                return (
                                                    <tr key={obj.coggleNo}>
                                                    <td>{obj.coggleNo}</td>
                                                    <td>{obj.coggleNo}</td>
                                                    <td>{obj.title}</td>
                                                    <td>{obj.firstRegDate}</td>
                                                    <td>{obj.firstRegDate}</td>
                                                    <td>{obj.like}</td>
                                                    <td>{obj.count}</td>
                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                        {/* map은 각각의 요소마다 return한다. */}
                                        
                                    </Table>
                                </div>
                                <div style={{marginTop:"50px", textAlign:"center"}}>
                                    {(() => {
                                        const array = [];
                                        for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
                                            if (i == pageInfo.curPage) {
                                            array.push(
                                                <span key={i}><Button style={{border:"none"}} color='secondary' className='numberbutton' value={i} onClick={pageRequest}>{i}</Button>&nbsp;&nbsp;</span>
                                            )
                                            } else {
                                            array.push(
                                                <span key={i}><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={i} onClick={pageRequest}>{i}</Button>&nbsp;&nbsp;</span>
                                            )
                                            }
                                        }
                                        if(pageInfo.curPage != 1)
                                        array.unshift(
                                            <span ><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage-1} onClick={pageRequest}>{"<"}</Button>&nbsp;&nbsp;</span>

                                        )
                                        if(pageInfo.curPage != Math.max(pageInfo.allPage))
                                        array.push(
                                            <span ><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage+1} onClick={pageRequest}>{">"}</Button>&nbsp;&nbsp;</span>

                                        )
                                        return array;
                                        })()}
                                </div>
                            </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
            </div >
    
}