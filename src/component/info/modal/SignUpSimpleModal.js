import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col, Input} from 'reactstrap';
import {useContext, useState, useRef, useEffect} from 'react';
import { HeaderSignUpContext } from '../dropdown/HeaderDropDownLogin';
import axios from "axios";

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
    const [errorMessage, setErrorMessage] = useState(''); // 입력한 이메일
    // const [inputEmail, setInputEmail] = useState(''); // 입력한 이메일
    const [email, setEmail] = useState({inputEmail: '', existsEmail:'', authEmail:''}); // 검증된 이메일
    const [certNumber, setCertNumber] = useState({inputCertNumber:'', permitCertNumber:''}); // 입력한 이메일
    const [password, setPassword] = useState(''); //비밀번호
    const [passwordChk, setPasswordChk] = useState(''); //비밀번호 확인

    const [flag, setFlag] = useState({emailRegFlag:false, emailExsitsFlag:false,  emailAuthFlag:false, passwordRegFlag:false, passwordChkFlag:false})
    const [signUpRequest, setSignUpRequest] = useState({email: email.authEmail, password:password});

    const emailInputRef = useRef();
    const emailPermitExistRef = useRef();
    const emailForbidExistRef = useRef();
    const emailForbidRegRef = useRef();
    const pwdPermitRef = useRef();
    const pwdForbidRef = useRef();
    const pwdChkPermitRef = useRef();
    const pwdChkForbidRef = useRef();
    const certPermitRef = useRef();
    const certForbidRef = useRef();


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
     * 유효성 검증 여부 2개 출력/숨김 메소드
     * @param {*} onRef - 출력 ref
     * @param {*} offRef - 숨김 ref
     */
    const validSuccessFail = (onRef,offRef) => {
        onRef.current.style.display = 'inline-block';
        offRef.current.style.display = 'none';
    }

    /**
     * 유효성 검증 여부 3개 출력/숨김 메소드
     * @param {*} onRef - 출력 ref
     * @param {*} offRef - 숨김 ref
     */
    const validThreeCase = (onRef,offRef1,offRef2) => {
        onRef.current.style.display = 'inline-block';
        offRef1.current.style.display = 'none';
        offRef2.current.style.display = 'none';
    }

    /**
     * 패스워드 일치 여부 공통 메소드
     * arg1 - 입력된 값 (패스워드 혹은 패스워드Chk)
     * arg2 - 패스워드 일치여부 비교대상
     * arg3 - NotNull : 패스워드 / null : 패스워드Chk
     * @param {*} currentValue - 입력된 값 
     * @param {*} equalPwd - 비교할 대상
     * @param {*} passwordRegFlag - pwd정규표현식 플래그
     * @returns 
     */
    const pwdChkEqual = (currentValue, equalPwd, passwordRegFlag) => {
        console.log(passwordRegFlag)
        /* 패스워드 일치여부에 대해서도 다시 확인 */
        if (equalPwd != '') {
            let passwordChkFlag = (currentValue != '' && currentValue == equalPwd) ? true : false ;
            if (passwordChkFlag) { 
                // 패스워드 일치 true
                validSuccessFail(pwdChkPermitRef, pwdChkForbidRef);
                // setFlag({...flag, passwordChkFlag: passwordChkFlag}); //Flag에 true저장
                passwordRegFlag == null ? setFlag({...flag, passwordChkFlag: passwordChkFlag}) : setFlag({...flag, passwordRegFlag:passwordRegFlag, passwordChkFlag: passwordChkFlag});
                return;
            }
            if (!passwordChkFlag) {
                // 패스워드 일치 false
                validSuccessFail(pwdChkForbidRef, pwdChkPermitRef);
                // setFlag({...flag, passwordChkFlag: passwordChkFlag}); //Flag에 false저장
                passwordRegFlag == null ? setFlag({...flag, passwordChkFlag: passwordChkFlag}) : setFlag({...flag, passwordRegFlag:passwordRegFlag, passwordChkFlag: passwordChkFlag});
                return;
            }
        }
        if (passwordRegFlag != null) return;
        pwdChkForbidRef.current.style.display = 'none';
        setFlag({...flag, passwordChkFlag: false}); //Flag에 false저장
    }

    /**
     * change이벤트 유효성 검증 메소드
     * 각각의 flag값에 반영한다.
     * @param {*} e 
     * @returns 
     */
    const changeEvent = (e) => {
        let currentValue = e.target.value;

        /* === 패스워드 정규표현식 유효성 검증 === */
        if (e.target.name == 'password') {
            setPassword(currentValue);
            const passwordRegExp = new RegExp(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-])(?=.*[A-Z]).{9,}$/);// 비밀번호에 대한 정규표현식
            let passwordRegFlag = passwordRegExp.test(currentValue) ? true : false;
            // pwdChkEqual(currentValue, passwordChk) // 패스워드 일치 체크!
            if (currentValue != '') { // 입력된 경우
                if (passwordRegFlag) { 
                    // 정규표현식 결과 true
                    // pwdChkEqual(currentValue, passwordChk) // 패스워드 일치 체크!
                    validSuccessFail(pwdPermitRef, pwdForbidRef);
                    setFlag({...flag, passwordRegFlag: passwordRegFlag}); //Flag에 true저장
                    // pwdChkEqual2(currentValue, passwordRegFlag, passwordChk)
                    pwdChkEqual(currentValue, passwordChk, passwordRegFlag);
                    return;
                    
                }
                if (!passwordRegFlag) {
                // 정규표현식 결과 false
                    // pwdChkEqual(currentValue, passwordChk) // 패스워드 일치 체크!
                    validSuccessFail(pwdForbidRef, pwdPermitRef);
                    setFlag({...flag, passwordRegFlag:passwordRegFlag}); //Flag에 flase저장            
                    // pwdChkEqual2(currentValue, passwordRegFlag, passwordChk)
                    pwdChkEqual(currentValue, passwordChk, passwordRegFlag);
                    return;
                }
                return;
            }
            if (currentValue == '') {
                // 백스페이스로 모두 지웠을경우
                // pwdChkEqual2(currentValue, passwordRegFlag, passwordChk)
                pwdChkEqual(currentValue, passwordChk, passwordRegFlag);

                // pwdChkEqual(currentValue, passwordChk) // 패스워드 일치 체크!
                emptyRefOff(pwdPermitRef, pwdForbidRef);
                setFlag({...flag, passwordRegFlag: passwordRegFlag});
                return;
            }
        }
        /* === 패스워드 확인 유효성 검증 === */
        if (e.target.name == 'passwordChk') {
            setPasswordChk(currentValue);
            // pwdChkEqual(currentValue, password) //비밀번호 체크!
            pwdChkEqual(currentValue, password, null);
            if (currentValue == '') {
                // 백스페이스로 모두 지웠을경우
                emptyRefOff(pwdChkPermitRef, pwdChkForbidRef);
                return;
            }
            // pwdChkEqual(currentValue, password) //비밀번호 체크!
        }
        if (e.target.name == 'email') {
            // setFlag({...flag, emailExsitsFlag:false})
            setEmail({...email, inputEmail : currentValue, existsEmail: ''}); //email 값 초기화
            // setEmail({...email, existsEmail: ''}); //입력되면 무조건 초기화
            const emailRegExp = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);// 비밀번호에 대한 정규표현식
            let emailRegFlag = emailRegExp.test(currentValue) ? true : false;
            if (currentValue == '') {
                // 백스페이스로 모두 지웠을경우
                setFlag({...flag, emailRegFlag: false, emailExsitsFlag:false});
                emailForbidRegRef.current.style.display = 'none';
                emptyRefOff(emailPermitExistRef, emailForbidExistRef);
                return;
            }
            if (currentValue != '' && !emailRegFlag) {
                setFlag({...flag, emailRegFlag: emailRegFlag, emailExsitsFlag:false});
                validThreeCase(emailForbidRegRef, emailPermitExistRef, emailForbidExistRef); //첫번째 매개변수만 On한다.
                return;
            }
            // 사용 가능한 이메일 이라면!
            if (currentValue != '' && emailRegFlag) {
                setFlag({...flag, emailRegFlag: emailRegFlag, emailExsitsFlag:false});
                emptyRefOff(emailForbidRegRef, emailPermitExistRef);

/*                 emailForbidRegRef.current.style.display = 'none';
                emailPermitExistRef.current.style.display = 'none'; */
                return;
            }

        }
        if (e.target.name == 'certNumber') {
            setCertNumber({...certNumber, inputCertNumber:currentValue}); //email 값 초기화
            return; // 이후 flag는 중복확인 버튼 클릭이벤트에서 처리한다.
        }
    }

    /**
     * 버튼 클릭이벤트 함수
     */
    const clickEvent = (e) => {
        // return; //일시 정지
        let name = e.target.name;

        /* [수정] */
        if (name == 'editBtn') {
            console.log("[수정]")
        }

        /* [중복확인] */
        if (name == 'existBtn') {
            if (email.inputEmail == '') {
                alert("이메일을 입력해주세요.");
                return;
            }
            if (!flag.emailRegFlag) {
                alert("사용이 불가능한 이메일입니다. \n안내문구를 확인 하셨다면 양식을 지켜주세요.");
                return;
            }
            const formData = new FormData();
            formData.append('email', email.inputEmail);
            axios.post('/email-exists' , formData)
            .then((response) => {
                console.log(response.data.exists)
                if (response.data.exists) { // 중복된 이메일
                    setFlag({...flag, emailExsitsFlag: !response.data.exists})
                    validThreeCase(emailForbidExistRef, emailForbidRegRef, emailPermitExistRef); //첫번째 매개변수만 On한다.
                    console.log(response.data.exists)
                    return;
                }
                if (!response.data.exists) { // 사용가능한 이메일
                    setEmail({...email, existsEmail: email.inputEmail});
                    setFlag({...flag, emailExsitsFlag: !response.data.exists})
                    validThreeCase(emailPermitExistRef, emailForbidRegRef, emailForbidExistRef); //첫번째 매개변수만 On한다.
                    console.log(response.data.exists)
                    return;
                }
            })
            .catch((error) => {

            })
        }

        /* [(재)발급] */
        if (name == 'sendBtn') {
            if(flag.emailExsitsFlag == true) {
                alert("메일 전송요청 완료. \n 입력하신 이메일을 확인해주세요.")
                const formData = new FormData();
                formData.append('email', email.existsEmail);
                axios.post('/email-auth' , formData)
                .then((response) => {
                    setCertNumber({...certNumber, permitCertNumber:response.data})
                })
                .catch((error) => {
                    alert("메일 전송에 실패했습니다. \n 관리자에게 문의하세요.")
                })
            }
            alert("메일 전송 불가능. \n 입력하신 이메일 중복여부를 확인해주세요.")
            setFlag({...flag, emailAuthFlag:false});
        }

        /* [인증] */
        if (name == 'authBtn') {
            console.log("[인증]")
            if (certNumber.inputCertNumber == certNumber.permitCertNumber) {
                alert('인증번호 완료')
                setFlag({...flag, emailAuthFlag:true})
                return;
            } 
            alert('인증번호가 일치하지 않습니다. \n 재 발급을 시도해보세요.')
            setFlag({...flag, emailAuthFlag:false});
            return;
        }

        /* [가입신청] */
        if (name == 'submit') {
            console.log(flag)
            console.log(email)
            if (!flag.emailRegFlag) {
                alert("이메일 양식 불량")
                return;
            }
            if (!flag.emailExsitsFlag) {
                alert("중복인증 체크")
                return;
            }
            if (!flag.emailAuthFlag) {
                alert("인증번호 체크")
                return;
            }
            if (!flag.passwordRegFlag) {
                alert("패스워드 표현식 안됨")
                return;
            }
            if (!flag.passwordChkFlag) {
                alert("패스워드 불일치함")
                return;
            }
            submit();
        }
    }

    const submit = () => {
        
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
                                    <span ref={emailForbidRegRef} style={{display:'none'}}>&#10060; 이메일 양식 오류</span>
                                    <span ref={emailForbidExistRef} style={{display:'none'}}>&#10060; 이미 사용중 입니다</span>
                                    <span ref={emailPermitExistRef} style={{display:'none'}}>&#10004; 사용가능</span>
                                    <Input ref={emailInputRef} type='email' name='email' id='email' value={email.inputEmail} onChange={changeEvent} />
                                </Col>
                                <Col sm={4}style={{width:'77px', paddingLeft:'0px'}}>
                                    <Button name="editBtn" style={{float:'right', width:'100%'}} outline color='secondary' size="sm" onClick={clickEvent} disabled>수정</Button>
                                    <Button name="existBtn" style={{position:'relative', width:'100%', top:'10px', float:'right'}} outline color='secondary' size="sm" onClick={clickEvent}>중복 확인</Button>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col sm={9} >
                                    <Label htmlFor='certNumber' sm={3}>인증번호</Label>
                                    <span ref={certPermitRef} style={{display:'none'}}>&#10004; 인증완료</span>
                                    <span ref={certForbidRef} style={{display:'none'}}>&#10060; 인증실패</span>
                                    <Input type='text' name='certNumber' id='certNumber' value={certNumber.inputCertNumber} onChange={changeEvent} />
                                </Col>
                                <Col sm={4}style={{width:'77px', paddingLeft:'0px'}}>
                                    <Button name="sendBtn" style={{float:'right', width:'100%'}} outline color='secondary' size="sm" onClick={clickEvent}>(재)발급</Button>
                                    <Button name="authBtn" style={{position:'relative', width:'100%', top:'10px', float:'right'}} outline color='secondary' size="sm" onClick={clickEvent}>인증</Button>
                                </Col>
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
                    <Button color="secondary" name='submit' onClick={clickEvent} style={{margin:"0 auto", width:"350px"}}>가입신청</Button>
                </ModalFooter>
            </Modal>
    )
}