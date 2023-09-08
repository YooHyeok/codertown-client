import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

export default function MammothDetail() {
    const divStyle = {
        width: '100%' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '850px'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '0px'
        , padding: '30px'
        , top: '100'
      };

    const userId = useSelector( (state) => {return state.UserId} );
    const accessToken = useSelector( (state) => {return state.Authorization} );
    const [src, setSrc] = useState('/default_profile3.png')
    /* [수정] 버튼 클릭시 글번호 파라미터 주소에 노출시키지 않고 history에 담아 처리 */
    const navigate = useNavigate();
    const { mammothNo } = useParams();
    const [mammoth, setMammoth] = useState(
        {   
            title: null,
            writer: {},
            nickname: '',
            content: '',
            link: '',
            views: 0,
            location: ''
        }
             )

    useEffect(()=> {
        axios.get(`/mammoth-detail/${mammothNo}`)
        .then((response)=> {
            setMammoth({...mammoth,     
                        title: response.data.title, 
                        content: response.data.content,
                        link: response.data.link,
                        writer : response.data.writer,
                        nickname: response.data.writer.nickname,
                        views: response.data.views,
                        location: response.data.location,
                        }      
            )
            setSrc(`/profileImage/${response.data.writer.email}`)
        })
        .catch((error) => {
            console.log(error);
        })
    },[])

    
    /* func - 삭제 기능 */
    const del = (e) => {
        alert("삭제 하시겠습니까?");

        const formData = new FormData();
        formData.append('recruitNo', mammothNo);

        axios.post('/recruit-delete', formData)
        .then((response)=> {
            document.location.href="/mammoth";
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return(
        <div style={divStyle}>
                <div style = {{width:'1200px', margin: '0px auto', borderBottom: '0px solid lightgray'}}>
                    <div style={{width:'220px', margin: '0px auto', display:"flex"}}>
                        <h1 style={{margin:"30px auto"}}><b>맘모스</b></h1>
                        <h6 style={{width:'130px',margin:"50px auto"}}>맘맞는사람 모여 스터디</h6>
                    </div>
                </div>
                {/* 글 제목 */}
                <div style = {{width:'1200px', margin: '0px auto', display:"flex", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{width:'1200px',margin:"30px 20px 10px 10px"}}>
                        <h5><b>{mammoth.title}</b></h5>
                        <img style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}} className="profile" src={src} alt="profile"/>
                        <div>
                            <span>{mammoth.nickname}</span> <br/> <span>{'2023-08-21'}</span> <span>조회수 {mammoth.views}</span>
                        </div>
                        {/* 수정 삭제 버튼 */}
                        {userId == mammoth.writer.email &&
                        <div className='update-delete-btn-gruop' style={{display:"flex", marginTop:"-40px", float:'right'}}>
                            <Button color='secondary' onClick={(e)=>{
                                    navigate('/mammoth-edit', { state: { mammothNo } });
                                }}>수정</Button>&nbsp;&nbsp;
                            <Button color='danger' onClick={del}>삭제</Button>
                        </div>}
                    </div>
                </div>
                {/* 글 내용 */}
                <div style={{clear:'both', display:'flex',width:'1200px', height:'100%', margin :'0px auto'}}>
                    {/* 토스트 뷰어 영역 */}
                    <div style={{ width: '725px', minHeight:'450px', fontSize: '16px', border: '0px soild lightgray'}}>
                        <Viewer initialValue={mammoth.content} key={mammoth.content}/>
                    </div>
                    {/* 프로젝트 상세정보 영역 */}
                    <div style={{ width:"475px", minHeight:'450px', height:"100%", float:'right', marginTop: '50px'}}>
                        <div style={{width:"475px", border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                            <Form style={{width:"410px", margin:"40px auto"}}>
                                <FormGroup row>
                                    {/* <Col sm={11}>
                                    <Label htmlFor='title' sm={2}>제목</Label>
                                        <Input type='text' name='title' id='title' />
                                    </Col> */}
                                    <Col sm={12} >
                                    <Label htmlFor='password' sm={6}>지역</Label>
                                        <Input type='text' name='location' id='location' value ={mammoth.location || ''} readOnly/>
                                    </Col>
                                    {/* <Col sm={6}>
                                    <Label htmlFor='email' sm={6}>성별 제한</Label>
                                        <Input type='text' name='teamName' id='teamName' value ={mammoth.gender} readOnly/>
                                    </Col>
                                    <Col sm={6}>
                                    <Label htmlFor='email' sm={5}>인원수</Label>
                                        <Input type='text' name='objectWeek' id='objectWeek' value ={mammoth.recruitCount} readOnly/>
                                    </Col> */}
                                    <Col sm={12}>
                                    <Label htmlFor='email' sm={6}>링크</Label>
                                        {/* <Input type='text' name='link' id='link' value ={mammoth.link} readOnly/> */}
                                        <Input style={{color:"blue", cursor: "pointer", textDecoration: "underline"}} type='text' name='link' id='link' value={mammoth.link || ''} readOnly onClick={(e)=>{
                                        let link = mammoth.link;
                                        if(link == null || link == '') {alert('링크가 비어있습니다.'); return;}
                                        if(link[0] != 'h')  link = 'http://'+ link;
                                        window.open(link, '_blank')
                                    }
                                    } />
                                    </Col>                            
                                </FormGroup>
                            </Form>
                        </div>
                        {(accessToken != '' && userId != mammoth.writer.email) &&
                        <div className='study-dm-btn-gruop' style={{textAlign:'center', margin: '100px auto'}}>
                            <Button color='primary'>스터디 참여 요청 DM 보내기</Button>
                        </div>}
                    </div>
                </div>
                {/* 댓글영역 */}
                {/* <div style = {{width:'1200px', margin: '50px auto', display:"flex", borderTop: '0.1px solid lightgray'}}>
                    <div style={{margin:"30px 20px 10px 10px"}}>
                        <h3 ><b>이곳은 댓글영역입니다</b></h3>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{'유혁스쿨'}</span> <br/> <span>{'2023-08-21'}</span>
                        </div>
                    </div>
                </div> */}
        </div>
        )
}