import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Form, Label, Input, Button, Col, FormGroup } from 'reactstrap';

export default function MyInfoEdit() {

    const [userin, setUserIn] = useState({
        nickname: '', id: '', password: '', postcode: '', address: '', addrDetail: '', email: '', thumbnail: null
    });

    /**
     * 기본 프로필 사진
     */
    const [src, setSrc] = useState('/default-profile.png');

    /**
     * 컴포넌트 생명주기 Hook
     */
    useEffect(() => {

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
        <Form style={{ width: "400px", margin: '40px auto'}}>
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
                    <span id="regnnTrue" style={{ display: "none" }}><p><b>알맞은 형식입니다. 중복 확인을 해주세요.</b></p></span>
                    <span id="regnnFalse" style={{ display: "none" }}><p><b>첫 글자는 영문자와 4~16자의 영문 대소문자, <br />숫자와 특수기호(_),(-)만 사용가능합니다.</b></p></span>
            </FormGroup>
            {/* 이메일 */}
            <FormGroup row>
                <Label htmlFor='email' sm={4}>이&nbsp;&nbsp;메&nbsp;&nbsp;일</Label>
                <Col sm={8}>
                    <Input type='email' name='email' id='email' value={""} onChange={(e)=>{e.preventDefault();}} required />
                </Col>
            </FormGroup>
            {/* 패스워드 */}
            <FormGroup row>
                <Label htmlFor='grade' sm={4}>패스워드</Label>
                <Col>
                    <Button outline color='secondary' style={{ width: '100%', marginBottom:"25px" }} onClick={(e)=>{e.preventDefault();}}>재발급</Button>
                </Col>
            </FormGroup>
            
            {/* 수정 완료 버튼 */}
            <FormGroup row>
                <Col sm={5} >
                    <Link to={'/mypage'}><Button color='secondary' style={{ width: '400px' }} onClick={(e)=>{e.preventDefault();}}>저장</Button></Link>
                </Col>
            </FormGroup>
        </Form>
    )
}