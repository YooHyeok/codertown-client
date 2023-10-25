import { useState, useEffect, useRef } from "react";
import { Form, Label, Input, Button, Col, FormGroup, Row } from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";
import useToast from "../../hook/useToast";
import { confirmAlert } from "react-confirm-alert"; // npm install react-confirm-alert --save --force
import { useNavigate } from 'react-router-dom';
import { red } from "@mui/material/colors";


export default function MyInfoEdit() {
    const navigate = useNavigate();
    
    const userId = useSelector( (state) => {return state.UserId} );
    const { toastAlertWarning, toastAlertSuccess, toastAlertSuccessCallback, toastAlertError} = useToast();
    const [profileInputValue, setProfileInputValue] = useState({
        originalProfileSrc:'',
        changeProfileSrc: '/profile_default.png',

        originNickname: '', 
        changeNickname: '', 

        originalCheckPwd: '', 
        changePwd: '', 
        changePwdChk: ''
    })

    /**
     * 컴포넌트 생명주기 Hook
     */
    useEffect(() => {
        /* 프로필 조회 */
        const formData = new FormData();
        formData.append('loginEmail', userId)
        axios.post('/user-info', formData)
        .then(response => {
            setProfileInputValue({
                ...profileInputValue, 
                originNickname:response.data.nickname, 
                changeNickname:response.data.nickname, 
                originalProfileSrc:`data:image/png;base64,${response.data.profileUrl}`,
                changeProfileSrc:`data:image/png;base64,${response.data.profileUrl}`
            })
        })
        .catch(error =>{
        })
    }, [])
    
    /**
     * 컴포넌트 생명주기 Hook
     */
    useEffect(() => {
        if (profileInputValue.changeNickname == profileInputValue.originNickname) {
            nicknamePermitExistRef.current.style.display='none';
            return;
        }
    }, [profileInputValue.changeNickname])

    /**
     * 첨부파일
     */
    const fileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = event => {
                setProfileInputValue((prevState) => ({
                    ...prevState, changeProfileSrc:event.target.result
                }));
            }
        }

    }

    /* 파일 이미지 클릭 */
    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        fileInputRef.current && fileInputRef.current.click();
    };

    /**
     * 프로필 
     */
    const readImage = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = e => {
                setProfileInputValue((prevState) => ({
                    ...prevState, changeProfileSrc:e.target.result
                }));
            }
        }
    }

    const nicknameForbidRegRef = useRef('');
    const nicknameForbidExistRef = useRef('');
    const nicknamePermitExistRef = useRef('');
    const pwdPermitRef = useRef();
    const pwdForbidRef = useRef();
    const pwdChkPermitRef = useRef();
    const pwdChkForbidRef = useRef();

    /**
     * 유효성 검증 여부 3개 출력/숨김 메소드
     * @param {*} onRef - 출력 ref
     * @param {*} offRef - 숨김 ref
     */
    const validThreeCase = (onRef,offRef1,offRef2) => {
        onRef.current.style.display = 'block';
        offRef1.current.style.display = 'none';
        offRef2.current.style.display = 'none';
    }

    /**
     * 유효성 검증 여부 2개 출력/숨김 메소드
     * @param {*} onRef - 출력 ref
     * @param {*} offRef - 숨김 ref
     */
    const validTwoCase = (onRef,offRef) => {
        onRef.current.style.display = 'block';
        offRef.current.style.display = 'none';
    }

    /**
     * 닉네임 OFF
     * @param {*} firstRef 
     * @param {*} secondRef 
     * @param {*} thirdRef 
     */
    const threeWayRefOff = (firstRef, secondRef, thirdRef) => {
        firstRef.current.style.display = 'none';
        secondRef.current.style.display = 'none';
        thirdRef.current.style.display = 'none';
    }

    /**
     * 패스워드 OFF
     * @param {*} firstRef 
     * @param {*} secondRef 
     * @param {*} thirdRef 
     */
    const twoWayRefOff = (firstRef, secondRef) => {
        firstRef.current.style.display = 'none';
        secondRef.current.style.display = 'none';
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
        if (equalPwd != '') {
            let passwordChkFlag = (currentValue != '' && currentValue == equalPwd) ? true : false ;
            if (passwordChkFlag) { // 패스워드 일치 true
                validTwoCase(pwdChkPermitRef, pwdChkForbidRef);
                passwordRegFlag == null ? setFlag({...flag, passwordChkFlag: passwordChkFlag}) : setFlag({...flag, passwordRegFlag:passwordRegFlag, passwordChkFlag: passwordChkFlag});
                return;
            }
            if (!passwordChkFlag) {// 패스워드 일치 false
                validTwoCase(pwdChkForbidRef, pwdChkPermitRef);
                passwordRegFlag == null ? setFlag({...flag, passwordChkFlag: passwordChkFlag}) : setFlag({...flag, passwordRegFlag:passwordRegFlag, passwordChkFlag: passwordChkFlag});
                return;
            }
        }
        if (passwordRegFlag != null) return;
        pwdChkForbidRef.current.style.display = 'none';
        setFlag({...flag, passwordChkFlag: false}); //Flag에 false저장
    }

    /* 유효성 검증 Flag 배열 */
    const [flag, setFlag] = useState({nicknameRegFlag:true, nicknameExsitsFlag:true, pwdIsChangedFlag:false, passwordRegFlag:false, passwordChkFlag:false})

    const inputChange = (e) => {
        let currentName = e.target.name;
        let currentValue = e.target.value;
        setProfileInputValue({...profileInputValue, [currentName] : currentValue})

        /* 닉네임 유효성 검증 */
        if(currentName == 'changeNickname') {
            const nicknameRegExp = new RegExp(/^[a-zA-Z가-힣][a-zA-Z가-힣0-9]{0,9}$/);// 닉네임에 대한 정규표현식
            let nicknameRegFlag = nicknameRegExp.test(currentValue) ? true : false;

             /* 백스페이스로 모두 지웠을 경우 */
            if (currentValue == '') {
                setFlag({...flag, nicknameRegFlag: nicknameRegFlag}); //Flag에 false저장
                validThreeCase(nicknameForbidRegRef,nicknameForbidExistRef,nicknamePermitExistRef);
                return;
            }
            /* 닉네임 중복여부 조회 */
            if (currentValue != '') {
                if (nicknameRegFlag) {// 정규표현식 결과 true
                    if (currentValue == profileInputValue.originNickname) {
                        nicknamePermitExistRef.current.style.display='none';
                        return;
                    }
                    threeWayRefOff(nicknameForbidRegRef, nicknameForbidExistRef, nicknamePermitExistRef)
                    
                    setFlag({...flag, nicknameRegFlag: nicknameRegFlag}); //Flag에 true저장
                    if (currentValue != profileInputValue.originNickname) {
                        const formData = new FormData();
                        formData.append('nickname', currentValue)
                        axios.post('/nickname-exists', formData)
                        .then(response => {
                            if(response.data.exists) {
                                validThreeCase(nicknameForbidExistRef, nicknameForbidRegRef, nicknamePermitExistRef);
                                return;
                            }
                            if(!response.data.exists) {
                                validThreeCase(nicknamePermitExistRef, nicknameForbidRegRef, nicknameForbidExistRef);
                                return;
                            }
                            return;
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    }
                    if (flag.nicknameRegFlag && flag.nicknameExsitsFlag) {
                        validThreeCase(nicknamePermitExistRef, nicknameForbidRegRef, nicknameForbidExistRef);
                        return;

                    }
                    return;
                }
                if (!nicknameRegFlag) {// 정규표현식 결과 false
                    setFlag({...flag, nicknameRegFlag: nicknameRegFlag}); //Flag에 false저장
                    validThreeCase(nicknameForbidRegRef, nicknamePermitExistRef, nicknameForbidExistRef);
                    return;
                }
                
            }
        }
        /* 패스워드 유효성 검증 */
        if (currentName == 'changePwd') {
            setProfileInputValue({...profileInputValue, changePwd:currentValue});
            const passwordRegExp = new RegExp(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-])(?=.*[A-Z]).{9,}$/);// 비밀번호에 대한 정규표현식
            let passwordRegFlag = passwordRegExp.test(currentValue) ? true : false;
            if (currentValue != '') { // 입력된 경우
                if (passwordRegFlag) { 
                    // 정규표현식 결과 true
                    validTwoCase(pwdPermitRef, pwdForbidRef);
                    setFlag({...flag, passwordRegFlag: passwordRegFlag}); //Flag에 true저장
                    pwdChkEqual(currentValue, profileInputValue.changePwdChk, passwordRegFlag);
                    return;
                    
                }
                if (!passwordRegFlag) {
                    // 정규표현식 결과 false
                    validTwoCase(pwdForbidRef, pwdPermitRef);
                    setFlag({...flag, passwordRegFlag:passwordRegFlag}); //Flag에 flase저장            
                    pwdChkEqual(currentValue, profileInputValue.changePwdChk, passwordRegFlag);
                    return;
                }
                return;
            }
            if (currentValue == '') {
                // 백스페이스로 모두 지웠을경우
                pwdChkEqual(currentValue, profileInputValue.changePwdChk, passwordRegFlag);
                twoWayRefOff(pwdPermitRef, pwdForbidRef);
                // setFlag({...flag, passwordRegFlag: passwordRegFlag});
                return;
            }
        }
        /* 패스워드 확인 유효성 검증 */
        if (currentName == 'changePwdChk') {
            setProfileInputValue({...profileInputValue, changePwdChk:currentValue});
            pwdChkEqual(currentValue, profileInputValue.changePwd, null);
            if (currentValue == '') {// 백스페이스로 모두 지웠을경우
                twoWayRefOff(pwdChkPermitRef, pwdChkForbidRef);
                return;
            }
        }

    }


    const submit = () => {
        if (profileInputValue.originalCheckPwd === '') {
            toastAlertWarning("회원정보 수정시 본인확인을 위해 기존 패스워드를 필수로 입력하셔야 합니다.")
            return;
        }
        if (    
                (profileInputValue.originalProfileSrc === profileInputValue.changeProfileSrc) 
             && (profileInputValue.originNickname === profileInputValue.changeNickname) 
             && (profileInputValue.changePwd === '')
             && (profileInputValue.changePwdChk === '')
                                                        ) {
            toastAlertWarning("수정된 내역이 없습니다.")
            return;
        }
        if (flag.nicknameRegFlag === false) {
            toastAlertWarning("닉네임 양식을 맞춰주세요.")
            return;
        }
        if (profileInputValue.changePwd != '') { //비밀번호 란이 비어있지 않다면
            if (!flag.passwordRegFlag) { // 정규표현식 체크
                toastAlertWarning("패스워드 조건에 맞지 않습니다. \n 입력란 문구를 확인해주세요.")
                return;
            }
            if (!flag.passwordChkFlag) { // 정규표현식 체크
                if (profileInputValue.changePwdChk == '') {
                    toastAlertWarning("패스워드 수정시 패스워드 확인은 필수입력 입니다.")
                    return;
                } 
                toastAlertWarning("패스워드 변경값과 확인값이 일치하지 않습니다.")
                return;
            }
        }

        const formData = new FormData();
        formData.append('loginEmail',userId)
        formData.append('nickname', profileInputValue.changeNickname)
        formData.append('password', profileInputValue.changePwd)
        formData.append('originalPassword', profileInputValue.originalCheckPwd)
        formData.append('profileUrl', profileInputValue.changeProfileSrc)
        // formData.forEach((value, key) => console.log(key, ":", value));
        // return;
        axios.post('/user-update', formData)
            .then(response => {
                if(response.data.success == false){
                    toastAlertWarning("기존 패스워드가 일치하지 않으므로 수정에 실패하였습니다.")
                    return;
                }
                toastAlertSuccessCallback("회원의 정보가 성공적으로 수정되었습니다!"
                , () => {
                    // navigate('/mypage', true)
                    // document.location.href='/mypage'
                })
                
            })
            .catch(error => {
            })
    }

    const accountWithdraw = () => {
        if (profileInputValue.originalCheckPwd === '') {
            toastAlertWarning("회원 탈퇴시 본인 확인을 위해 기존 패스워드를 필수로 입력하셔야 합니다.")
            return;
        }
        confirmAlert({
            title: "회원 탈퇴 확인",
            message: '탈퇴시 개인정보 및 관련 코끼리/맘모스/코글/댓글/채팅방이 삭제되며 복구할수 없게 됩니다.  \n 정말 탈퇴 하시겠습니까?',
            buttons: [
              {
                label: "확인",
                onClick: () => {
                    const formData = new FormData();
                    formData.append('loginId',userId)

                    axios.post("/joined-project-count", formData)
                    .then((response)=>{
                        if(response.data > 0) {
                            toastAlertWarning("참여 프로젝트가 모집/진행중이라면 탈퇴가 불가능합니다.")
                            return;
                        }
                        axios.post("/change-status-account", formData)
                            .then((response)=>{
                                console.log(response)
                                if(response.data.success == true) {
                                    toastAlertSuccess("회원 탈퇴 완료")
                                }
                            })
                            .catch((error)=>{
                                toastAlertError("참여 프로젝트가 모집/진행중이라면 탈퇴가 불가능합니다.")
                            })
                    })
                    .catch((error)=>{
                    })
                },
              },
              {
                label: "취소",
                onClick: () => { },
              },
            ],
          });
    }

    /**
     * JSX 시작
     */
    return (
        <Form style={{ width: "300px", height:'500px', margin: '20px auto'}}>
            {/* 프로필 */}
            <FormGroup row  style={{margin:'20px auto', width:'200px', height:'150px'}} >
                <Col sm={12}>
                    <input ref={fileInputRef} type="file" name="file" id="file" onChange={fileChange} accept='image/*' style={{ display:'none'}}/> 
                    <img className="profile" src={profileInputValue.changeProfileSrc} alt="profile" onClick={handleImageClick}/>
                    <img style={{filter: 'hue-rotate(6deg)', position:'relative', bottom:'45px', left:'55px', width:'32px', height:'32px'}} src="/free-icon-pencil.png" alt="profile edit"/>
                </Col>
            </FormGroup>
            {/* 닉네임 */}
            <FormGroup >
                <Col sm={12}>
                    <Label htmlFor='changeNickname' style={{width:'75px', textAlign:'left', float:'left'}}>닉&nbsp;&nbsp;네&nbsp;&nbsp;임</Label>
                    <span ref={nicknameForbidRegRef} style={{display:'none', color:'red'}}>&#10060; 닉네임 양식 오류</span>
                    <span ref={nicknameForbidExistRef} style={{display:'none', color:'red'}}>&#10060; 이미 사용중 입니다</span>
                    <span ref={nicknamePermitExistRef} style={{display:'none', color:'#0d6efd'}}>&#10004; 사용가능</span>
                    <Input type='text' name='changeNickname' id='nickname' value={profileInputValue.changeNickname} placeholder="첫글자 한or영문자 & 특수문자를 제외한 10자리 " onChange={inputChange} required />
                </Col>
            </FormGroup>
            {/* 패스워드 */}
            <FormGroup >
                <Col sm={12}>
                    <Label htmlFor='changePwd' style={{width:'75px', textAlign:'left', float:'left'}}>패스워드 변경</Label>
                    <span ref={pwdPermitRef} style={{display:'none', color:'#0d6efd'}}>&#10004; 사용가능</span>
                    <span ref={pwdForbidRef} style={{display:'none', color:'red'}}>&#10060; 패스워드 사용불가</span>
                    <Input type='password' name='changePwd' id='changePwd' value={profileInputValue.changePwd} placeholder="특수문자/대문자 각각 1자 이상 & 최소 10자리" onChange={inputChange} required />
                </Col>
            </FormGroup>
            <FormGroup >
                <Col sm={12}>
                    <Label htmlFor='changePwdChk' style={{width:'75px', textAlign:'left',float:'left'}}>패스워드 확인</Label>
                    <span ref={pwdChkPermitRef} style={{display:'none', color:'#0d6efd'}}>&#10004; 패스워드 일치</span>
                    <span ref={pwdChkForbidRef} style={{display:'none', color:'red'}}>&#10060; 패스워드 불일치</span>
                    <Input type='password' name='changePwdChk' id='changePwdChk' value={profileInputValue.changePwdChk} placeholder="재입력" onChange={inputChange} required />
                </Col>
            </FormGroup>
            <FormGroup>
                <Col sm={12}>
                    <Label htmlFor='originalCheckPwd' style={{float:'left'}} >기존 패스워드</Label>
                    <Input type='password' name='originalCheckPwd' id='originalCheckPwd' value={profileInputValue.originalCheckPwd} placeholder="정보 변경시 본인확인 필수입력" onChange={inputChange} required />
                </Col>         
            </FormGroup>
            {/* 수정 완료 버튼 */}
            <FormGroup row>
                <Col sm={6}>
                    <Button color='primary' outline style={{width:'139px'}} onClick={(e)=>{e.preventDefault();}}>초기화</Button>
                </Col>
                <Col sm={6}>
                    <Button color='secondary' style={{width:'139px'}} onClick={submit}>저장</Button>
                </Col>
            </FormGroup>
            <FormGroup row >
                <Col sm={15} >
                    <Button color='danger' outline style={{width:'300px'}} onClick={accountWithdraw}>회원탈퇴</Button>
                </Col>
            </FormGroup>
        </Form>
    )
}