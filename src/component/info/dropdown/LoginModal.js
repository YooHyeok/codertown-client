import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input } from 'reactstrap';
import {useContext, useState} from 'react';
import { HeaderLoginContext } from './HeaderDropDownLogin';
import { Link } from 'react-router-dom';

export default function LoginModal() {
    const context = useContext(HeaderLoginContext);
    const modalStyle = { 
        width: "500px",
        height: "500px",
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
                <ModalBody>
                    <Form style={{margin:"20px auto", marginBottom:"-40px", paddingLeft:"30px"}}>
                        <FormGroup row style={{paddingLeft:"20px"}}>
                            <Label htmlFor='email' sm={2}>이&nbsp;&nbsp;메&nbsp;&nbsp;일</Label>
                            <Col sm={8}>
                                <Input type='text' name='email' id='email' />
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{paddingLeft:"20px"}}>
                            <Label htmlFor='password' sm={2}>패스워드</Label>
                            <Col sm={8}>
                                <Input type='text' name='password' id='password' />
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{paddingLeft:"20px"}}>
                            <Col sm={10}>
                                <Input type='checkbox' name='rememberMe' id='rememberMe' /> &nbsp;Remember Me
                                <div style={{width:"350px", position:"relative", top:"-20px"}}>
                                    <Link style={{float:"right"}} onClick={(e)=>{e.preventDefault(); context.signUpToggle();}}>회원가입</Link> <br/>
                                    <Link style={{float:"right"}}>아이디/패스워드 찾기</Link>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter style={{width:"500px"}}>
                    <Button color="secondary" onClick={context.loginToggle} style={{margin:"0 auto", width:"350px"}}>로그인</Button>
                </ModalFooter>
            </Modal>
    )
}