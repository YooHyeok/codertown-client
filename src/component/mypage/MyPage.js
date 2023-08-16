// import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Form, Label, Input, Button, Col, FormGroup, TabContent, TabPane, Nav, NavItem, NavLink, Table, Row} from 'reactstrap';
import { BsFillSuitHeartFill } from "react-icons/bs"

import classnames from 'classnames';
import './MyPage.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다. 토큰값과 userId값을 가져온다.

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
    const userId = useSelector((state) => { return state.UserId });

    const [userin, setUserIn] = useState({
        nickname: '', id: '', password: '', postcode: '', address: '', addrDetail: '', email: '', thumbnail: null
    });

    const [src, setSrc] = useState('/default-profile.png');
    useEffect(() => {
        /* axios.get('/mypage', { params: { id: userId } })
            .then((res) => {
                console.log(res);
                console.log(res.data);
                setUser(res.data);
                if (res.data.filename != null) {
                    setSrc("/profile/" + res.data.id);
                }
            }).catch((error) => {
                console.log(error)
            }) */
    }, [])

    // Tab
    const [tabChange, setTabChange] = useState({activeTab:'1'});

    const tabToggle = (tab) => {
        console.log(tab)
        if (tabChange.activeTab !== tab) {
            setTabChange({activeTab: tab})
        }
    }

    // 첨부파일
    const fileChange = (e) => {
        setUserIn({ ...userin, thumbnail: e.target.files[0] })
        console.log(e.value);
        readImage(e.target);

    }
    const readImage = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = e => {
                setSrc(e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
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
                            <Row>
                            <Col sm="12">
                                {/* 내정보 수정 시작 */}
                                <Form style={{ width: "400px", margin: '40px auto'}}>
                                    {/* 프로필 */}
                                    <div className="profile-wrap" style={{ marginBottom:"50px"}}>
                                        <img className="profile" src={src} alt="profile"/>
                                    </div>
                                    <FormGroup row >
                                        <Col sm={5}>
                                            <Input bsSize="sm" type="file" name="file" id="file" onChange={fileChange} accept='image/*' style={{ width: '400px', marginBottom:"25px"}}/>
                                        </Col>
                                    </FormGroup>
                                    {/* 닉네임 */}
                                    <FormGroup row>
                                        <Label htmlFor='nickname' sm={4}>닉&nbsp;&nbsp;네&nbsp;&nbsp;임</Label>
                                        <Col sm={5}>
                                            <Input type='text' name='nickname' id='nickname' value={""} onChange={(e)=>{e.preventDefault();}} required />
                                        </Col>
                                        <Col sm={3} >
                                            <Button outline color='secondary' style={{ width: '100%' }} onClick={(e)=>{e.preventDefault();}}>중복</Button>
                                        </Col>
                                            <span id="regnnTrue" style={{ display: "none" }}><p><b>알맞은 형식입니다. 중복 확인을 해주세요.</b></p></span>
                                            <span id="regnnFalse" style={{ display: "none" }}><p><b>첫 글자는 영문자와 4~16자의 영문 대소문자, <br />숫자와 특수기호(_),(-)만 사용가능합니다.</b></p></span>
                                    </FormGroup>
                                    {/* 이메일 */}
                                    <FormGroup row>
                                        <Label htmlFor='email' sm={4}>이&nbsp;&nbsp;메&nbsp;&nbsp;일</Label>
                                        <Col sm={8}>
                                            <Input type='email' name='email' id='email' value={""} onChange={(e)=>{e.preventDefault();}} required />
                                        </Col>
                                    </FormGroup>
                                    {/* 패스워드 */}
                                    <FormGroup row>
                                        <Label htmlFor='grade' sm={4}>패스워드</Label>
                                        <Col>
                                            <Button outline color='secondary' style={{ width: '100%', marginBottom:"25px" }} onClick={(e)=>{e.preventDefault();}}>재발급</Button>
                                        </Col>
                                    </FormGroup>
                                    
                                    {/* 수정 완료 버튼 */}
                                    <FormGroup row>
                                        <Col sm={5} >
                                            <Link to={'/mypage'}><Button color='secondary' style={{ width: '400px' }} onClick={(e)=>{e.preventDefault();}}>저장</Button></Link>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="2">
                            <Row>
                            <Col sm="12">
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
                            <Col sm="12">
                                <h4>Tab 3 Contents</h4>
                            </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
            </div >
    
}