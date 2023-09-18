import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Form, Label, Input, Button, Col, FormGroup } from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";

export default function MyInfoEdit() {

    const userId = useSelector( (state) => {return state.UserId} );

    const [profileInputValue, setProfileInputValue] = useState({
        originalProfile:'/default_profile3.png', attachFile: null,  nickname: '', originalPwd: '', changePwd: '', changePwdChk: ''
    })

    /**
     * 컴포넌트 생명주기 Hook
     */
    useEffect(() => {
        /* 프로필 조회 */
        axios.get(`/profileImage/${userId}`)
        .then((response)=>{
            if (response.data == '') setProfileInputValue({originalProfile:'/default_profile3.png'})
            else {
            setProfileInputValue({...profileInputValue, originalProfile:`/profileImage/${userId}`})
            /* 프로필 데이터를 받아온 후 user정보 조회 */
            if (profileInputValue.originalProfile != '/default_profile3.png'){
                const formData = new FormData();
                formData.append('loginEmail', userId)
                /* user정보 조회 */
                axios.post('/user-info', formData)
                .then(response => {
                    setProfileInputValue({...profileInputValue, nickname:response.data.nickname, attachFile:response.data.attachFile})
                })
                .catch(error =>{
                })
            }
        };
        })
        
    }, [])

    /**
     * 첨부파일
     */
    const fileChange = (e) => {
        setProfileInputValue({ ...profileInputValue, attachFile: e.target.files[0] })
        readImage(e.target);

    }

    /**
     * 프로필 
     */
    const readImage = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = e => {
                // setSrc(e.target.result);
                setProfileInputValue({originalProfile:e.target.result});
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    
    const inputChange = (e) => {
        setProfileInputValue({...profileInputValue, [e.target.name] : e.target.value})
        
        if(e.target.name == 'nickname') {
            const formData = new FormData();
            /* 닉네임 중복여부 조회 */
            formData.append('nickname', e.target.value)
            axios.post('/nickname-exists', formData)
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {

            })
        }
    }

    /**
     * JSX 시작
     */
    return (
        <Form style={{ width: "400px", margin: '30px auto'}}>
            {/* 프로필 */}
            <div className="profile-wrap" style={{ marginBottom:"50px"}}>
                <img className="profile" src={profileInputValue.originalProfile} alt="profile"/>
            </div>
            <FormGroup row >
                <Col sm={5}>
                    <Input type="file" name="file" id="file" onChange={fileChange} accept='image/*' style={{ width: '400px', marginBottom:"25px"}}/>
                </Col>
            </FormGroup>
            {/* 닉네임 */}
            <FormGroup row>
                <Label htmlFor='nickname' sm={4}>닉&nbsp;&nbsp;네&nbsp;&nbsp;임</Label>
                <Col sm={5}>
                    <Input type='text' name='nickname' id='nickname' value={profileInputValue.nickname} onChange={inputChange} required />
                </Col>
                <Col sm={3} >
                    <Button outline color='secondary' style={{ width: '100%' }} onClick={(e)=>{e.preventDefault();}}>중복</Button>
                </Col>
            </FormGroup>
            {/* 패스워드 */}
            <FormGroup row>
                <Label htmlFor='originalPwd' sm={4}>기존 패스워드</Label>
                <Col sm={8}>
                    <Input type='text' name='originalPwd' id='originalPwd' value={profileInputValue.originalPwd} placeholder="본인 확인을 위해 패스워드를 입력하세요" onChange={inputChange} required />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor='changePwd' sm={4}>패스워드 변경</Label>
                <Col sm={8}>
                    <Input type='text' name='changePwd' id='changePwd' value={profileInputValue.changePwd} placeholder="비밀번호 변경시 입력해주세요" onChange={inputChange} required />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor='changePwdChk' sm={4}>패스워드 확인</Label>
                <Col sm={8}>
                    <Input type='text' name='changePwdChk' id='changePwdChk' value={profileInputValue.changePwdChk} placeholder="비밀번호 변경시 입력해주세요" onChange={inputChange} required />
                </Col>
            </FormGroup>
            {/* 이메일 */}
            {/* <FormGroup row>
                <Col sm={12}>
                    <Label htmlFor='email' style={{float:"left"}}>이&nbsp;&nbsp;메&nbsp;&nbsp;일</Label>
                    <Button style={{float:"right"}} outline color='secondary' onClick={(e)=>{e.preventDefault();}}>중복</Button>
                    <Input type='email' name='email' id='email' value={""} onChange={(e)=>{e.preventDefault();}} required />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor='nickname' sm={4}>인증번호</Label>
                <Col sm={5}>
                    <Input type='text' name='nickname' id='nickname' value={""} onChange={(e)=>{e.preventDefault();}} required />
                </Col>
                <Col sm={3} >
                    <Button outline color='secondary' style={{ width: '100%' }} onClick={(e)=>{e.preventDefault();}}>인증</Button>
                </Col>
            </FormGroup> */}
            
            
            {/* 수정 완료 버튼 */}
            <FormGroup row style={{width:'424px'}}>
                <Col sm={6} style={{float:'right'}}>
                    <Button color='secondary' outline style={{width:'188px'}} onClick={(e)=>{e.preventDefault();}}>초기화</Button>
                </Col>
                <Col sm={6} style={{float:'left'}}>
                    <Button color='secondary' style={{width:'188px'}} onClick={(e)=>{e.preventDefault();}}>저장</Button>
                </Col>
            </FormGroup>
            <FormGroup row style={{width:'424px'}}>
                <Col sm={15} >
                    <Button color='danger' outline style={{width:'400px'}} onClick={(e)=>{e.preventDefault();}}>회원탈퇴</Button>
                </Col>
            </FormGroup>
        </Form>
    )
}