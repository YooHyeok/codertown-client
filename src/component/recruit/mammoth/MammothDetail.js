import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import BookMarkButton from '../../button/BookMarkButton.js';
import useToast from '../../../hook/useToast.js';
import { confirmAlert } from "react-confirm-alert"; // npm install react-confirm-alert --save --force

export default function MammothDetail() {
    const divStyle = {
        width: '100%' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '0px'
        , padding: '30px'
        , top: '100'
      };

    const {toastAlertWarning, toastAlertSuccess} = useToast();
    const userId = useSelector( (state) => {return state.UserId} );
    const accessToken = useSelector( (state) => {return state.Authorization} );
    const [src, setSrc] = useState('/default_profile.png')
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
            location: '',
            views: 0,
            isBookmarked: false,
            isBookMarkedCount: 0
        }
             )

    useEffect(()=> {
        axios.get(`/mammoth-detail/${mammothNo}/${userId}`)
        .then((response)=> {
            setMammoth({...mammoth,     
                        title: response.data.title, 
                        content: response.data.content,
                        link: response.data.link,
                        writer : response.data.writer,
                        nickname: response.data.writer.nickname,
                        location: response.data.location.fullLocation,
                        views: response.data.views,
                        isBookmarked: response.data.isBookmarked,
                        isBookMarkedCount: response.data.isBookMarkedCount,
                        }      
            )
            /* 프로필사진 초기화 */
            setSrc(`data:image/png;base64,${response.data.writer.profileUrl}`)
            setIsBookmarked(response.data.isBookmarked)
        })
    },[])

    
    /* func - 삭제 기능 */
    const del = (e) => {
        confirmAlert({
            title: '맘모스 삭제 확인',
            message: '삭제 하시겠습니까?',
            buttons: [
              {
                label: "확인",
                onClick: () => {
                    const formData = new FormData();
                    formData.append('recruitNo', mammothNo);

                    axios.post('/recruit-delete', formData)
                    .then((response)=> {
                        document.location.href="/mammoth";
                    })
                    .catch((error) => {
                        console.log(error);
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

    /* 북마크 토글 */
    const [isBookmarked, setIsBookmarked] = useState(mammoth.isBookmarked)
    const toggle = (e) => {
        if (userId == '') {
            toastAlertWarning('북마크 기능을 이용하시려면 로그인이 필요합니다.');
            return;}
        const formData = new FormData();
        formData.append('recruitNo', mammothNo);
        formData.append('userId', userId);
    
        axios.post('/recruit-bookmark-toggle', formData)
        .then((response) => {
            toastAlertSuccess(response.data.success ? "북마크에 추가되었습니다." : "북마크 해제 되었습니다.");
            setIsBookmarked(response.data.success)
            response.data.success ?  setMammoth({...mammoth, isBookMarkedCount: mammoth.isBookMarkedCount+1}): setMammoth({...mammoth, isBookMarkedCount: mammoth.isBookMarkedCount-1})
           
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
                                    <Label htmlFor='password' sm={6}>모임 위치</Label>
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
                                        if(link == null || link == '') {toastAlertWarning('링크가 비어있습니다. 이동할 수 없습니다.'); return;}
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
            {/* 조회수 & 북마크기능 & 댓글카운트  */}
            <div style = {{width:'1200px', margin: '0px auto', display:"flex"}}>
                
                <div style = {{width:'50px', margin: '0px', display:"flex"}}>
                    <div onClick={toggle} ><BookMarkButton isBookmarked={isBookmarked} /></div>
                    &nbsp;{mammoth.isBookMarkedCount}
                </div>
                <div style = {{width:'50px', margin: '0px', display:"flex"}}>
                    <div >👀</div>
                    &nbsp;{mammoth.views}
                </div>
                
            </div>
        </div>
        )
}