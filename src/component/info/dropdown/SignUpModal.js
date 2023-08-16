import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Input } from 'reactstrap';
import {useContext} from 'react';
import { HeaderSignUpContext } from './HeaderDropDownLogin';

export default function SignUpModal() {
    const context = useContext(HeaderSignUpContext);
    const modalStyle = { 
        width: "500px",
        height: "500px"
        , top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }

    return(
        <div>
            <Modal isOpen={context.signUpShow} toggle={context.signUpToggle} style={modalStyle}>
            <ModalHeader toggle={context.signUpToggle} >
                <span style={{textAlign:"center !important"}}>회원가입</span>
                </ModalHeader>
            <ModalBody>
                <div style={{margin:"20px auto", paddingLeft:"30px"}}>
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
                </div>
            </ModalBody>
            <ModalFooter >
                <Button color="secondary" onClick={context.signUpToggle} style={{margin:"0 auto", width:"350px"}}>가입신청</Button>
            </ModalFooter>
            </Modal>
        </div>
    )
}