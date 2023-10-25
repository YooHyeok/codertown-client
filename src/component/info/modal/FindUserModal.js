import {TabContent, TabPane, Nav, NavItem, NavLink, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Row, Col, Input} from 'reactstrap';
import {useContext, useState} from 'react';
import { HeaderSignUpContext } from '../dropdown/HeaderDropDownLogin';
import classnames from 'classnames';


export default function FindUserModal() {
    const context = useContext(HeaderSignUpContext);
    const modalStyle = { 
        width: "325px",
        // height: "500px",
        top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }

    // Tab
    const [tabChange, setTabChange] = useState({activeTab:'1'});

    const tabToggle = (tab) => {
        console.log(tab)
        if (tabChange.activeTab !== tab) {
            setTabChange({activeTab: tab})
        }
    }

    return(
            <Modal isOpen={context.findUserShow} toggle={context.findUserToggle} style={modalStyle}>
                <ModalHeader style={{height:"50px", borderBottom:"1px solid black"}}>
                    <Nav style={{position:"relative", width: "290px", height:"30px", top:"10px", borderBottom:"1px solid black"}} tabs >
                        <NavItem>
                            <NavLink style={{ height:"30px"}} className={classnames({ active: tabChange.activeTab === '1' })} onClick={() => { tabToggle('1'); }} >
                            <span style={{position: 'relative', top:"-35px", userSelect:"none", fontSize:"17px"}} >이메일 찾기</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink style={{ height:"30px"}} className={classnames({ active: tabChange.activeTab === '2' })} onClick={() => { tabToggle('2'); }}>
                            <span style={{position: 'relative', top:"-35px", userSelect:"none", fontSize:"17px"}} >패스워드 찾기</span>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </ModalHeader>
                <TabContent activeTab={tabChange.activeTab}>
                    <TabPane tabId="1">
                        <ModalBody style={{height:"125px"}}>
                            <Form >
                                <FormGroup >
                                    <Row>
                                        <Col sm={12}>
                                            <Input type='text' name='phoneNumber' id='phoneNumber' placeholder='등록한 핸드폰번호를 입력해주세요'/>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup >
                                    <Row>
                                        <Col>
                                            <Input type='text' name='nickname' id='nickname' placeholder='사용자 닉네임을 입력해주세요.'/>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter >
                            <Button outline color="secondary" style={{width:"285px"}}
                                onClick={(e)=>{
                                    e.preventDefault();
                            }}>이메일 찾기</Button>
                        </ModalFooter>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={tabChange.activeTab}>
                    <TabPane tabId="2">
                        <ModalBody style={{height:"70px"}}>
                            <Form >
                                <FormGroup >
                                    <Row>
                                        <Col sm={12}>
                                            <Input type='text' name='email' id='email' placeholder='사용자 이메일을 입력해 주세요'/>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter >
                            <Button outline color="secondary" style={{width:"285px"}}
                                onClick={(e)=>{
                                    e.preventDefault();
                            }}>패스워드 찾기</Button>
                        </ModalFooter>
                    </TabPane>
                </TabContent>
            </Modal>
    )
}