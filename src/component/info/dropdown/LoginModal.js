import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col, Input } from 'reactstrap';
import {useContext} from 'react';
import { HeaderLoginContext } from './HeaderDropDownLogin';
import { Link } from 'react-router-dom';

export default function LoginModal() {
    const context = useContext(HeaderLoginContext);
    const modalStyle = { 
        width: "320px",
        top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }
    return(
            <Modal isOpen={context.loginShow} toggle={context.loginToggle} style={modalStyle}>
                <ModalHeader toggle={context.loginToggle} >
                    <span style={{textAlign:"center !important"}}>로그인</span>
                </ModalHeader>
                <ModalBody >
                    <Form>
                        <FormGroup>
                            <Row>
                                <Col sm={12}>
                                    <Label htmlFor='email' sm={2}>이메일</Label>
                                    <Input type='text' name='email' id='email' />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Label htmlFor='password' sm={2}>패스워드</Label>
                                    <Input type='text' name='password' id='password' />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col sm={12}>
                                    <Input type='checkbox' name='rememberMe' id='rememberMe' /> &nbsp;Remember Me
                                    <Link style={{float:"right"}} 
                                          onClick={(e)=>{
                                            e.preventDefault();
                                            context.loginToggle(); //현재 토글 닫기.
                                            context.signUpToggle(); // 회원가입 토글 열기.
                                    }}>회원가입</Link> <br/>
                                    <Link style={{float:"right"}}>아이디/패스워드 찾기</Link>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={(e)=>{e.preventDefault();}} style={{margin:"0 auto", width:"350px"}}>로그인</Button>
                </ModalFooter>
            </Modal>
    )
}