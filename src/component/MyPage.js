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
        , height: '600px'
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

    const [src, setSrc] = useState('/default-profile.jpg');
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
                <div style={{width:"500px", margin:"0 auto"}}>
                    <Nav style={{height:"50px", margin:"100 auto"}} tabs >
                    <NavItem>
                        <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '1' })} onClick={() => { tabToggle('1'); }} >
                        <span style={{position: 'relative', top:"-20px"}} >내정보 수정</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '2' })} onClick={() => { tabToggle('2'); }}>
                        <span style={{position: 'relative', top:"-20px"}} >나의 프로젝트</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ height:"50px"}} className={classnames({ active: tabChange.activeTab === '3' })} onClick={() => { tabToggle('3'); }}>
                        <span style={{position: 'relative', top:"-20px"}} >나의 게시글</span>
                        </NavLink>
                    </NavItem>
                    </Nav>
                    <TabContent activeTab={tabChange.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                            <Col sm="12">
                                <h4>Tab 1 Contents</h4>
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
                </div>
            </div >
    
}