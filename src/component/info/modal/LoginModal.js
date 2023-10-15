import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col, Input } from 'reactstrap';
import {useContext, useState} from 'react';
import { HeaderLoginContext } from '../dropdown/HeaderDropDownLogin';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { type } from '@testing-library/user-event/dist/type';

export default function LoginModal() {
    const context = useContext(HeaderLoginContext);
    const modalStyle = { 
        width: "320px",
        top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }
    const [signInInfo, setSignInInfo] = useState({email:'', password:''});
    const inputChange = (e) => {
        setSignInInfo({...signInInfo, [e.target.name]:e.target.value});
    }
    const [cookie, setCookie] = useCookies(['refreshToken']);
    const dispatch = useDispatch();

    const userId = useSelector((state) => {return state.UserId});

    const inputEnterLogin = (e)=>{
        if (e.key == 'Enter') {
            submit();
        }
    }
    const submit = async () => {
        if(signInInfo.email == ''){
            alert('이메일을 입력해주세요');
            return;
        }
        if(signInInfo.password == ''){
            alert('패스워드를 입력해주세요');
            return;
        }
        await axios.post('/sign-in', signInInfo)
        .then((response)=>{
            if(response.data.signStatus.code == -1) {
                alert('입력하신 회원정보가 일치하지 않습니다. \n 회원 정보를 찾으시려면 아래 아이디/패스워드 찾기를 눌러주세요')
                return;
            }
            if(response.data.signStatus.code == 0) {
                dispatch({type:"NEWTOKEN", data: response.data.signInResult.createToken})
                dispatch({type:"USERID", data: response.data.signInResult.email})
                dispatch({type:"NICKNAME", data: response.data.signInResult.nickname})
                const expires = new Date();
                expires.setDate(expires.getDate() + 1); //현재날짜 + 1 = 하루
                setCookie('refreshToken', response.data.signInResult.refreshToken, {url:'/',expires})
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        if(userId != undefined && userId != null && userId != '') document.location.href='/'
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
                                    <Input type='text' name='email' id='email' value={signInInfo.email} onChange={inputChange} onKeyDown={inputEnterLogin}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Label htmlFor='password' sm={2}>패스워드</Label>
                                    <Input type='password' name='password' id='password' value={signInInfo.password} onChange={inputChange} onKeyDown={inputEnterLogin}/>
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
                                    <Link style={{float:"right"}}
                                          onClick={(e)=>{
                                            e.preventDefault();
                                            context.loginToggle(); //현재 토글 닫기.
                                            context.findUserToggle(); // 간편 회원가입 토글 열기.
                                    }}>아이디/패스워드 찾기</Link>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={submit} style={{margin:"0 auto", width:"350px"}}>로그인</Button>
                </ModalFooter>
            </Modal>
    )
}