import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input } from 'reactstrap';
import {useContext, useState} from 'react';
import { HeaderLoginContext } from './HeaderDropDownLogin';
import { Link } from 'react-router-dom';

export default function LoginModal() {
    const context = useContext(HeaderLoginContext);
    const modalStyle = { 
        width: "350px",
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
                <ModalBody style={{width: "350px", height:"250px", margin:"0px auto"}}>
                    <Form style={{marginBottom:"0px"}}>
                        <FormGroup>
                            <Label htmlFor='email' sm={2}>이메일</Label>
                            <Col sm={12}>
                                <Input type='text' name='email' id='email' />
                            </Col>
                            <Label htmlFor='password' sm={2}>패스워드</Label>
                            <Col sm={12}>
                                <Input type='text' name='password' id='password' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={12}>
                                <Input type='checkbox' name='rememberMe' id='rememberMe' /> &nbsp;Remember Me
                                <div style={{width:"310px", position:"relative", top:"-20px"}}>
                                    <Link style={{float:"right"}} onClick={(e)=>{e.preventDefault(); context.signUpToggle();}}>회원가입</Link> <br/>
                                    <Link style={{float:"right"}}>아이디/패스워드 찾기</Link>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={context.loginToggle} style={{margin:"0 auto", width:"350px"}}>로그인</Button>
                </ModalFooter>
            </Modal>
    )
}