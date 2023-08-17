import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col, Input} from 'reactstrap';
import {useContext} from 'react';
import { HeaderSignUpContext } from './HeaderDropDownLogin';

export default function SignUpModal() {
    const context = useContext(HeaderSignUpContext);
    const modalStyle = { 
        width: "320px",
        // height: "500px",
        top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }

    return(
            <Modal isOpen={context.signUpShow} toggle={context.loginShow == true ? context.signInterToggle : context.signUpToggle} style={modalStyle}>
                <ModalHeader toggle={context.loginShow == true ? context.signInterToggle : context.signUpToggle} >
                    <span style={{textAlign:"center !important"}}>간편 회원가입</span>
                </ModalHeader>
                <ModalBody>
                    <Form >
                        <FormGroup >
                            <Row>
                                <Col sm={12} >
                                    <Label htmlFor='email' sm={2}>이메일</Label>
                                    <span>&#10004; 사용가능</span>
                                    <span>&#10060; 사용불가</span>
                                    <Button style={{float:"right"}} outline color='secondary' size="sm" className="existsBtn" onClick={(e)=>{e.preventDefault();}}>중복 확인</Button>
                                    <Input type='text' name='email' id='email' />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup >
                            <Row>
                                <Col sm={12}>
                                    <Label htmlFor='email' sm={2}>인증번호</Label>
                                    <span>&#10004; 인증완료</span>
                                    <span>&#10060; 인증실패</span>
                                    <Button style={{float:"right"}} outline color='secondary' size="sm" className="emailAuthBtn" onClick={(e)=>{e.preventDefault();}}>인증</Button>
                                    <Input type='text' name='emailAuthNumber' id='emailAuthNumber' />&nbsp;
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Label htmlFor='password' sm={2}>패스워드</Label>
                                    <span>&#10060; 패스워드 양식에 어긋납니다</span>
                                    <Input type='text' name='password' id='password' placeholder='특수문자, 대문자를 각각 1자 이상 포함한 12자리' />
                                </Col>
                                <Col sm={12}>
                                    <Label htmlFor='password2' sm={2}>재입력</Label>
                                    <span>&#10004; 패스워드 일치</span>
                                    <span>&#10060; 패스워드 불일치</span>
                                    <Input type='text' name='password2' id='password' />
                                    
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter >
                    <Button color="secondary" onClick={context.loginShow == true ? context.signInterToggle : context.signUpToggle} style={{margin:"0 auto", width:"350px"}}>가입신청</Button>
                </ModalFooter>
            </Modal>
    )
}