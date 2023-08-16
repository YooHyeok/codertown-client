import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import {useContext} from 'react';
import { HeaderSignUpContext } from './HeaderDropDownLogin';

export default function SignUpModal() {
    const context = useContext(HeaderSignUpContext);
    const modalStyle = { 
        width: "500px",
        height: "500px",
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
                    <Form style={{margin:"20px auto", paddingLeft:"20px"}}>
                        <FormGroup row >
                            <Label style={{width:"95px"}} htmlFor='email' sm={2}>이&nbsp;&nbsp;메&nbsp;&nbsp;일</Label>
                            <Col sm={8} style={{display:"flex"}}>
                                <Input type='text' name='email' id='email' style={{width:"213px"}}/>&nbsp;
                                <Button outline color='secondary' className="CheckBtn" onClick={(e)=>{e.preventDefault();}}>중복 확인</Button>
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{paddingLeft:"0px"}}>
                            <Label style={{width:"95px"}} htmlFor='password' sm={2}>패스워드</Label>
                            <Col sm={8}>
                                <Input type='text' name='password' id='password' />
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{paddingLeft:"0px"}}>
                            <Label style={{width:"95px"}} htmlFor='password2' sm={2}>패스워드 확인</Label>
                            <Col sm={8}>
                                <Input type='text' name='password2' id='password' />
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter >
                    <Button color="secondary" onClick={context.loginShow == true ? context.signInterToggle : context.signUpToggle} style={{margin:"0 auto", width:"350px"}}>가입신청</Button>
                </ModalFooter>
            </Modal>
    )
}