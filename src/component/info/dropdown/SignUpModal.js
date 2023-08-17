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
                    <span style={{textAlign:"center !important"}}>회원가입</span>
                </ModalHeader>
                <ModalBody>
                <Form >
                    <FormGroup >
                        <Row>
                            <Col>
                                <Button color="success" onClick={context.loginShow == true ? context.signInterToggle : context.signUpToggle} style={{width:"285px"}}>네이버로 시작하기</Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup >
                        <Row>
                            <Col>
                                <Button color="warning" onClick={context.loginShow == true ? context.signInterToggle : context.signUpToggle} style={{width:"285px"}}>카카오로 시작하기</Button>
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
                </ModalBody>
                <ModalFooter >
                    <Button outline color="secondary" onClick={context.loginShow == true ? context.signInterToggle : context.signUpToggle} style={{width:"285px"}}>ID / PW 회원가입</Button>
                </ModalFooter>
            </Modal>
    )
}