import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col, Input} from 'reactstrap';
import {useContext} from 'react';
import { HeaderSignUpContext } from '../dropdown/HeaderDropDownLogin';


export default function SignUpModal() {
    const context = useContext(HeaderSignUpContext);
    const modalStyle = { 
        width: "325px",
        // height: "500px",
        top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }

    return(
            <Modal isOpen={context.signUpShow} toggle={context.signUpToggle} style={modalStyle}>
            <ModalHeader toggle={context.signUpToggle} >
                    <span style={{textAlign:"center !important"}}>회원가입</span>
                </ModalHeader>
                <ModalBody>
                <Form >
                    <FormGroup >
                        <Row>
                            <Col>
                                <Button color="success" onClick={(e)=>{e.preventDefault();}} style={{width:"285px"}}>네이버로 시작하기</Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup >
                        <Row>
                            <Col>
                                <Button color="warning" onClick={(e)=>{e.preventDefault();}} style={{width:"285px"}}>카카오로 시작하기</Button>
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
                </ModalBody>
                <ModalFooter >
                    <Button outline color="secondary" style={{width:"285px"}}
                        onClick={(e)=>{
                            e.preventDefault();
                            context.signUpToggle(); //현재 토글 닫기.
                            context.signUpSimpleToggle(); // 간편 회원가입 토글 열기.
                    }}>ID / PW 회원가입</Button>
                </ModalFooter>
            </Modal>
    )
}