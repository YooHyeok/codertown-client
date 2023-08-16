// import axios from "axios";
import { useState, useEffect } from "react";
import { Form, Label, Input, Button, Col, FormGroup, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row} from 'reactstrap';
import classnames from 'classnames';
import './MyPage.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다. 토큰값과 userId값을 가져온다.

export default function MyPage() {
    const divStyle = {
        width: '1200px'
        , height: '700px'
        , textAlign: 'center'
        , margin: '100px auto'
        , marginBottom: '74px'
        , padding: '30px'
        , top: '100'
    };

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

    // 주소 모달
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

    return <div style={divStyle} >
                <div><h1><b> My Page</b></h1></div><br />
                <div className="screen-wrap">
                    <div style={{width:"500px", margin:"0 auto"}}>
                        <Nav style={{height:"50px"}} tabs >
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
                                <h4>Tab 2 Contents</h4>
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