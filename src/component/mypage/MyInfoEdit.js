import { useState, useEffect, useRef } from "react";
import { Form, Label, Input, Button, Col, FormGroup, Row } from 'reactstrap';
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

    const nicknameForbidExistRef = useRef('');
    const nicknamePermitExistRef = useRef('');
    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        // console.log(fileInputRef.current);
        fileInputRef.current && fileInputRef.current.click();

      };
    /**
     * JSX 시작
     */
    return (
        <Form style={{ width: "200px", height:'500px', margin: '20px auto'}}>
            {/* 프로필 */}
            <FormGroup row  style={{margin:'20px auto', height:'150px'}} >
                <Col sm={12}>
                    <input ref={fileInputRef} type="file" name="file" id="file" onChange={fileChange} accept='image/*' style={{ display:'none'}}/> 
                    <img className="profile" src={profileInputValue.originalProfile} alt="profile" onClick={handleImageClick}/>
                    <img style={{filter: 'hue-rotate(6deg)', position:'relative', bottom:'40px', left:'55px', width:'32px', height:'32px'}} src="/free-icon-pencil.png" alt="profile edit"/>
                </Col>
            </FormGroup>
            {/* 닉네임 */}
            <FormGroup >
                <Col sm={12}>
                    <Label htmlFor='nickname' style={{ float:'left'}}>닉&nbsp;&nbsp;네&nbsp;&nbsp;임</Label>
                    <Label ref={nicknameForbidExistRef} style={{display:'flex', float:'right'}}>&#10060; 이미 사용중 입니다</Label>
                    <span ref={nicknamePermitExistRef} style={{display:'none', float:'right'}}>&#10004; 사용가능</span>
                    <Input type='text' name='nickname' id='nickname' value={profileInputValue.nickname} onChange={inputChange} required />
                </Col>
            </FormGroup>
            {/* 패스워드 */}
            <FormGroup >
                <Col sm={12}>
                    <Label htmlFor='changePwd' style={{float:'left'}}>패스워드 변경</Label>
                    <Input type='text' name='changePwd' id='changePwd' value={profileInputValue.changePwd} placeholder="비밀번호 변경시 입력해주세요" onChange={inputChange} required />
                </Col>
            </FormGroup>
            <FormGroup >
                <Col sm={12}>
                    <Label htmlFor='changePwdChk' style={{float:'left'}}>패스워드 확인</Label>
                    <Input type='text' name='changePwdChk' id='changePwdChk' value={profileInputValue.changePwdChk} placeholder="비밀번호 변경시 입력해주세요" onChange={inputChange} required />
                </Col>
            </FormGroup>
            <FormGroup>
                <Col sm={12}>
                    <Label htmlFor='originalPwd' style={{float:'left'}} >기존 패스워드</Label>
                    <Input type='text' name='originalPwd' id='originalPwd' value={profileInputValue.originalPwd} placeholder="정보 변경시 필수 사항입니다" onChange={inputChange} required />
                </Col>         
            </FormGroup>
            {/* 수정 완료 버튼 */}
            <FormGroup row>
                <Col sm={6} style={{float:'right'}}>
                    <Button color='primary' outline style={{width:'88px'}} onClick={(e)=>{e.preventDefault();}}>초기화</Button>
                </Col>
                <Col sm={6} style={{float:'left'}}>
                    <Button color='secondary' style={{width:'88px'}} onClick={(e)=>{e.preventDefault();}}>저장</Button>
                </Col>
            </FormGroup>
            <FormGroup row >
                <Col sm={15} >
                    <Button color='danger' outline style={{width:'200px'}} onClick={(e)=>{e.preventDefault();}}>회원탈퇴</Button>
                </Col>
            </FormGroup>
        </Form>
    )
}