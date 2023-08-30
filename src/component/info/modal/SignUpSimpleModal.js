import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col, Input} from 'reactstrap';
import {useContext, useState, useRef} from 'react';
import { HeaderSignUpContext } from '../dropdown/HeaderDropDownLogin';

export default function SignUpSimpleModal() {
    const context = useContext(HeaderSignUpContext);
    const modalStyle = { 
        width: "320px",
        // height: "500px",
        top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }
    const [inputEmail, setInputEmail] = useState(''); // 입력한 이메일
    const [emailAuth, setEmailAuth] = useState({authEmail:'', emailAuthFlag: false}); // 입력한 이메일
    const [certNumber, setCertNumber] = useState(''); // 입력한 이메일
    const [password, setPassword] = useState(''); //비밀번호
    const [passwordChk, setPasswordChk] = useState(''); //비밀번호 확인

    const [flag, setFlag] = useState({emailRegFlag:false, emailAuthFlag:emailAuth.emailAuthFlag, passwordRegFlag:false, passwordChkFlag:false})
    const [signUpRequest, setSignUpRequest] = useState({email: emailAuth.authEmail, password:password});

    const emailPermitRef = useRef();
    const emailForbidRef = useRef();
    const pwdPermitRef = useRef();
    const pwdForbidRef = useRef();
    const pwdChkPermitRef = useRef();
    const pwdChkForbidRef = useRef();


    /**
     * 백스페이스로 모두 지웠을경우
     * @param {*} permitRef 
     * @param {*} forbidRef 
     */
    const emptyRefOff = (permitRef,forbidRef) => {
        permitRef.current.style.display = 'none';
        forbidRef.current.style.display = 'none';
    }
    /**
     * 유효성 검증 여부 출력/숨김 메소드
     * @param {*} onRef - 출력 ref
     * @param {*} offRef - 숨김 ref
     */
    const validSuccessFail = (onRef,offRef) => {
        onRef.current.style.display = 'inline-block';
        offRef.current.style.display = 'none';
    }

    /**
     * change이벤트 유효성 검증 메소드
     * 각각의 flag값에 반영한다.
     * @param {*} e 
     * @returns 
     */
    const changeEvent = (e) => {
        let currentValue = e.target.value;
        /* 패스워드 정규표현식 유효성 검증 */
        if (e.target.name == 'password') {
            setPassword(currentValue);
            const passwordRegExp = new RegExp(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-])(?=.*[A-Z]).{9,}$/);// 비밀번호에 대한 정규표현식
            let passwordRegFlag = passwordRegExp.test(currentValue) ? true : false;
            if (currentValue == '') {
                // 백스페이스로 모두 지웠을경우
                emptyRefOff(pwdForbidRef, pwdPermitRef);
                return;
            }
            if (passwordRegFlag) { 
                // 정규표현식 결과 true
                validSuccessFail(pwdPermitRef, pwdForbidRef);
                setFlag({...flag, passwordRegFlag: passwordRegFlag}); //Flag에 true저장
                return;
            }
            // 정규표현식 결과 false
            validSuccessFail(pwdForbidRef, pwdPermitRef);
            setFlag({...flag, passwordRegFlag: passwordRegFlag}); //Flag에 false저장
            return;
        }
        /* 패스워드 확인 유효성 검증 */
        if (e.target.name == 'passwordChk') {
            setPasswordChk(currentValue);
            // console.log(password)
            let passwordChkFlag = currentValue == password ? true : false ;
            if (currentValue == '') {
                // 백스페이스로 모두 지웠을경우
                emptyRefOff(pwdChkPermitRef, pwdChkForbidRef);
                return;
            }
            if (passwordChkFlag) { 
                // 정규표현식 결과 true
                validSuccessFail(pwdChkPermitRef, pwdChkForbidRef);
                setFlag({...flag, passwordChkFlag: passwordChkFlag}); //Flag에 true저장
                return;
            }
            // 정규표현식 결과 false
            validSuccessFail(pwdChkForbidRef, pwdChkPermitRef);
            setFlag({...flag, passwordChkFlag: passwordChkFlag}); //Flag에 false저장
        }
        if (e.target.name == 'email') {
            setInputEmail(currentValue); //email 값 초기화
            return; // 이후 flag는 중복확인 버튼 클릭이벤트에서 처리한다.
        }
        if (e.target.name == 'certNumber') {
            setCertNumber(currentValue); //email 값 초기화
            return; // 이후 flag는 중복확인 버튼 클릭이벤트에서 처리한다.
        }
    }

    /**
     * [수정] 버튼 클릭이벤트 함수
     */
    const editEmailBtnClick = () => {
        console.log("[수정]")
    }
    /**
     * [중복확인] 버튼 클릭이벤트 함수
     */
    const existEmailBtnClick = () => {
        console.log("[중복확인]")
    }
    /**
     * [재발급] 버튼 클릭이벤트 함수
     */
    const sendNumBtnClick = () => {
        console.log("[(재)전송)]")
    }
    /**
     * [인증] 버튼 클릭이벤트 함수
     */
    const authBtnClick = () => {
        console.log("[인증]")
    }
    const submit = (e) => {
        console.log(flag);
    }
    return(
            <Modal isOpen={context.signUpSimpleShow} toggle={context.signUpSimpleToggle} style={modalStyle}>
                <ModalHeader toggle={context.signUpSimpleToggle} >
                    <span style={{textAlign:"center !important"}}>간편 회원가입</span>
                </ModalHeader>
                <ModalBody>
                    <Form >
                        <FormGroup>
                            <Row>
                                <Col sm={9} >
                                    <Label htmlFor='email' sm={3}>이메일</Label>
                                    <span ref={emailPermitRef} style={{display:'none'}}>&#10004; 사용가능</span>
                                    <span ref={emailForbidRef} style={{display:'none'}}>&#10060; 사용불가</span>
                                    <Input type='email' name='email' id='email' value={inputEmail} onChange={changeEvent} />
                                </Col>
                                <Col sm={4}style={{width:'77px', paddingLeft:'0px'}}>
                                    <Button style={{float:'right', width:'100%'}} outline color='secondary' size="sm" className="existsBtn" onClick={editEmailBtnClick}>수정</Button>
                                    <Button style={{position:'relative', width:'100%', top:'10px', float:'right'}} outline color='secondary' size="sm" className="existsBtn" onClick={existEmailBtnClick}>중복 확인</Button>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col sm={9} >
                                    <Label htmlFor='certNumber' sm={3}>인증번호</Label>
                                    <span ref={emailPermitRef} style={{display:'none'}}>&#10004; 사용가능</span>
                                    <span ref={emailForbidRef} style={{display:'none'}}>&#10060; 사용불가</span>
                                    <Input type='text' name='certNumber' id='certNumber' value={certNumber} onChange={changeEvent} />
                                </Col>
                                <Col sm={4}style={{width:'77px', paddingLeft:'0px'}}>
                                    <Button style={{float:'right', width:'100%'}} outline color='secondary' size="sm" className="existsBtn" onClick={sendNumBtnClick}>(재)발급</Button>
                                    <Button style={{position:'relative', width:'100%', top:'10px', float:'right'}} outline color='secondary' size="sm" className="existsBtn" onClick={authBtnClick}>인증</Button>
                                </Col>
                                {/* <Col sm={9}>
                                    <Label htmlFor='email' sm={3}>인증번호</Label>
                                    <span>&#10004; 인증완료</span>
                                    <span>&#10060; 인증실패</span>
                                    <Input type='text' name='emailAuthNumber' id='emailAuthNumber' />&nbsp;
                                </Col>
                                <Col sm={4}style={{width:'77px', height:'76px', paddingLeft:'0px'}}>
                                    <Button style={{float:'right', width:'100%'}} outline color='secondary' size="sm" className="existsBtn" onClick={existEmail}>(재)전송</Button>
                                    <Button style={{position:'relative', width:'100%', top:'10px', float:'right'}} outline color='secondary' size="sm" className="existsBtn" onClick={existEmail}>인증</Button>
                                </Col> */}
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Label htmlFor='password' sm={2}>패스워드</Label>
                                    <span ref={pwdPermitRef} style={{display:'none'}}>&#10004; 사용가능</span>
                                    <span ref={pwdForbidRef} style={{display:'none'}}>&#10060; 패스워드 사용불가</span>
                                    <Input type='password' value={password} onChange={changeEvent} name='password' id='password' placeholder='특수문자, 대문자를 각각 1자 이상 포함한 최소 10자리' />
                                </Col>
                                <Col sm={12}>
                                    <Label htmlFor='passwordChk' sm={2}>재입력</Label>
                                    <span ref={pwdChkPermitRef} style={{display:'none'}}>&#10004; 패스워드 일치</span>
                                    <span ref={pwdChkForbidRef} style={{display:'none'}}>&#10060; 패스워드 불일치</span>
                                    <Input type='password' value={passwordChk} onChange={changeEvent} name='passwordChk' id='passwordChk' />
                                    
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter >
                    <Button color="secondary" onClick={submit} style={{margin:"0 auto", width:"350px"}}>가입신청</Button>
                </ModalFooter>
            </Modal>
    )
}