import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Form, Label, Input, Button, Col, FormGroup } from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";

export default function MyInfoEdit() {

    const [userin, setUserIn] = useState({
        nickname: '', id: '', password: '', postcode: '', address: '', addrDetail: '', email: '', thumbnail: null
    });

    const userId = useSelector( (state) => {return state.UserId} );

    /**
     * 기본 프로필 사진
     */
    const [src, setSrc] = useState('/default_profile3.png');
    // const [src, setSrc] = useState();

    /**
     * 컴포넌트 생명주기 Hook
     */
    useEffect(() => {
        axios.get(`/profileImage/${userId}`)
        .then((response)=>{
            if (response.data == '') setSrc('/default_profile3.png')
            else setSrc(`/profileImage/${userId}`);
        })
    }, [])

    /**
     * 첨부파일
     */
    const fileChange = (e) => {
        setUserIn({ ...userin, thumbnail: e.target.files[0] })
        readImage(e.target);

    }

    /**
     * 프로필 
     */
    const readImage = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = e => {
                setSrc(e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    /**
     * JSX 시작
     */
    return (
        <Form style={{ width: "400px", margin: '30px auto'}}>
            {/* 프로필 */}
            <div className="profile-wrap" style={{ marginBottom:"50px"}}>
                <img className="profile" src={src} alt="profile"/>
            </div>
            <FormGroup row >
                <Col sm={5}>
                    <Input bsSize="sm" type="file" name="file" id="file" onChange={fileChange} accept='image/*' style={{ width: '400px', marginBottom:"25px"}}/>
                </Col>
            </FormGroup>
            {/* 닉네임 */}
            <FormGroup row>
                <Label htmlFor='nickname' sm={4}>닉&nbsp;&nbsp;네&nbsp;&nbsp;임</Label>
                <Col sm={5}>
                    <Input type='text' name='nickname' id='nickname' value={""} onChange={(e)=>{e.preventDefault();}} required />
                </Col>
                <Col sm={3} >
                    <Button outline color='secondary' style={{ width: '100%' }} onClick={(e)=>{e.preventDefault();}}>중복</Button>
                </Col>
            </FormGroup>
            {/* 패스워드 */}
            <FormGroup row>
                <Label htmlFor='nickname' sm={4}>기존 패스워드</Label>
                <Col sm={8}>
                    <Input type='text' name='nickname' id='nickname' onChange={(e)=>{e.preventDefault();}} required />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor='nickname' sm={4}>바꿀 패스워드</Label>
                <Col sm={8}>
                    <Input type='text' name='nickname' id='nickname' onChange={(e)=>{e.preventDefault();}} required />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor='nickname' sm={4}>패스워드 확인</Label>
                <Col sm={8}>
                    <Input type='text' name='nickname' id='nickname' onChange={(e)=>{e.preventDefault();}} required />
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
            <FormGroup row>
                <Col sm={5} >
                    <Link to={'/mypage'}><Button color='secondary' style={{ width: '400px' }} onClick={(e)=>{e.preventDefault();}}>저장</Button></Link>
                </Col>
            </FormGroup>
        </Form>
    )
}