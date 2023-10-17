import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import { Table } from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import BookmarkButton from '../../button/BookmarkButton.js';
import { confirmAlert } from "react-confirm-alert"; // npm install react-confirm-alert --save --force
// import { toast } from 'react-toastify';
import useToast from '../../../hook/useToast.js';


// import _ from 'lodash'; // Lodash 라이브러리
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function CokkiriDetail() {
    const divStyle = {
        width: '100%' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '0px'
        , padding: '30px'
        , top: '100'
      };
    const userId = useSelector( (state) => {return state.UserId} );
    const accessToken = useSelector( (state) => {return state.Authorization} );
    /* [수정] 버튼 클릭시 글번호 파라미터 주소에 노출시키지 않고 history에 담아 처리 */
    const navigate = useNavigate();
    const { cokkiriNo } = useParams();
    const [projectPartNo, setProjectPartNo] = useState()
    const [partNo, setPartNo] = useState()
    const [selectProjectParts, setSelectProjectParts] = useState([])
    const [cokkiri, setCokkiri] = useState(
        {   
            title: null,
            writer: {},
            nickname: '',
            content: '',
            link: '',
            views: 0,
            isBookmarked: false,
            isBookMarkedCount: 0,
            objectWeek: 0,
            subject: '',
            teamName: '',
            projectNo: '',
            projectParts: [],
        }
    )
    // const notify = (msg) => toast(msg);
    const [src, setSrc] = useState('/default_profile.png')
    const requestCokkiriDetail = () => {
        axios.get(`/cokkiri-detail/${cokkiriNo}/${userId == '' ? null : userId}`)
        .then((response)=> {
            setCokkiri({...cokkiri,     
                        title: response.data.cokkiriDto.title, 
                        writer: response.data.cokkiriDto.writer,
                        nickname: response.data.cokkiriDto.writer.nickname,
                        content: response.data.cokkiriDto.content,
                        link: response.data.cokkiriDto.link,
                        views: response.data.cokkiriDto.views,
                        isBookmarked: response.data.cokkiriDto.isBookmarked,
                        isBookMarkedCount: response.data.cokkiriDto.isBookMarkedCount,
                        objectWeek: response.data.projectDto.objectWeek,
                        subject: response.data.projectDto.subject,
                        teamName: response.data.projectDto.teamName,
                        /* projectParts 리스트에서 projectPartNo가 1(팀장)이 아니고 로그인한 아이디가 요청한 프로젝트파트들을 제외한다. */
                        projectParts: response.data.projectDto.projectParts,
                        projectNo: response.data.projectDto.projectNo,
                        
                    })
            /* default projectPartNo 필터링 첫번째 요소 */
            setProjectPartNo(response.data.projectDto.projectParts.filter(obj => !response.data.takedProjectPartNos.includes(obj.projectPartNo))[0].projectPartNo)
            /* select option projectParts 필터링 */
            setSelectProjectParts(response.data.projectDto.projectParts.filter(obj => !response.data.takedProjectPartNos.includes(obj.projectPartNo)))
            /* 프로필사진 초기화 */
            setSrc(`data:image/png;base64,${response.data.cokkiriDto.writer.profileUrl}`)
            setIsBookmarked(response.data.cokkiriDto.isBookmarked)
        })
        .catch((error) => {
            console.log(error);
        })
    }
    useEffect(()=> {
        requestCokkiriDetail();
    },[])

    /* func - 삭제 기능 */
    const del = (e) => {

        

        confirmAlert({
            title: '코끼리 삭제 확인',
            message: '삭제 하시겠습니까?',
            buttons: [
              {
                label: "확인",
                onClick: () => {
                    const formData = new FormData();
                    formData.append('recruitNo', cokkiriNo);

                    axios.post('/recruit-delete', formData)
                    .then((response)=> {
                        document.location.href="/cokkiri";
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
    const [isBookmarked, setIsBookmarked] = useState(cokkiri.isBookmarked)
    const toggle = (e) => {
        if (userId == '') {
            toastAlertWarning('북마크 기능을 이용하시려면 로그인이 필요합니다.');
            return;}
        const formData = new FormData();
        formData.append('recruitNo', cokkiriNo);
        formData.append('userId', userId);
    
        axios.post('/recruit-bookmark-toggle', formData)
        .then((response) => {
            toastAlertSuccess(response.data.success ? "북마크에 추가되었습니다." : "북마크 해제 되었습니다.");
            setIsBookmarked(response.data.success)
            response.data.success ?  setCokkiri({...cokkiri, isBookMarkedCount: cokkiri.isBookMarkedCount+1}): setCokkiri({...cokkiri, isBookMarkedCount: cokkiri.isBookMarkedCount-1})
           
        })
        .catch((error) => {
        console.log(error);
        })
    }

    const { toastAlertWarning, toastAlertSuccess, toastAlertError } = useToast();

    const submit = (e) => {
        confirmAlert({
            title: "파트 신청 확인",
            message: '신청하신 파트에 대한 프로젝트 참가 요청 채팅방이 생성됩니다 진행하시겠습니까?',
            buttons: [
              {
                label: "확인",
                onClick: () => {
                    let params = {loginId:userId,writerId:cokkiri.writer.email,projectNo:cokkiri.projectNo,projectPartNo:projectPartNo}
                    axios.post('/create-cokkiri-chatroom', params)
                    .then((response) => {
                        if(response.data.success == true) {
                            setCokkiri({...cokkiri, isChatMaden: true})
                            // notify("채팅방 생성 완료 채팅방을 확인해주세요")
                            toastAlertSuccess("채팅방 생성 완료 채팅방을 확인해주세요")
                            requestCokkiriDetail();
                        }
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        toastAlertError("채팅방 생성에 실패하였습니다.")
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

    return(
        <div style={divStyle}>
            
                <div style = {{width:'1200px', margin: '0px auto', borderBottom: '0px solid lightgray'}}>
                    <div style={{width:'220px', margin: '0px auto', display:"flex"}}>
                        <h1 style={{margin:"30px auto"}}><b>코끼리</b></h1>
                        <h6 style={{width:'130px',margin:"50px auto"}}>코딩하는 사람 끼리</h6>
                    </div>
                </div>
                {/* 글 제목 */}
                <div style = {{width:'1200px', margin: '0px auto', display:"flex", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{width:'1200px',margin:"30px 20px 10px 10px"}}>
                        <h5><b>{cokkiri.title}</b></h5>
                        <img style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}} className="profile" src={src} alt="profile"/>
                        <div>
                            <span>{cokkiri.nickname}</span> <br/> <span>{'2023-08-21'}</span> <span>조회수 {cokkiri.views}</span>
                        </div>

                        {/* 수정 삭제 버튼 */}
                        {userId == cokkiri.writer.email &&
                        <div className='update-delete-btn-gruop' style={{display:"flex", marginTop:"-40px", float:'right'}}>
                            <Button color='secondary' onClick={(e)=>{
                                navigate('/cokkiri-edit', { state: { cokkiriNo } });
                            }}>수정</Button>&nbsp;&nbsp;
                            <Button color='danger' onClick={del}>삭제</Button>
                        </div>}
                    </div>
                </div>
                {/* 글 내용 */}
                <div style={{display:'flex',width:'1250px', height:'100%', margin :'0px auto'}}>
                    {/* 토스트 뷰어 영역 */}
                    <div style={{ width: '725px', margin:"0px 25px", minHeight:'450px'}}>
                        <Viewer className="toast-viewer" initialValue={cokkiri.content} key={cokkiri.content}/>
                    </div>
                    {/* 프로젝트 상세정보 영역 */}
                    <div style={{width:"475px", minHeight:"498px", height:"100%", float:'right', marginTop:"50px"}}>
                        <div style={{width:"475px", minHeight:'300px', border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                            <Form style={{width:"450px", margin:"30px"}}>
                                <FormGroup row>
                                    <Col sm={11} >
                                    <Label htmlFor='password' sm={6}>프로젝트 상세 주제</Label>
                                        <Input type='text' name='subject' id='subject' value={cokkiri.subject || ''} readOnly/>
                                    </Col>
                                    <Col sm={7}>
                                    <Label htmlFor='email' sm={6}>팀 이름</Label>
                                        <Input type='text' name='teamName' id='teamName' value={cokkiri.teamName || ''} readOnly/>
                                    </Col>
                                    <Col sm={4}>
                                    <Label htmlFor='email' sm={6}>목표 기간(주)</Label>
                                        <Input type='number' name='objectWeek' id='objectWeek' value={cokkiri.objectWeek || ''} readOnly/>
                                    </Col>
                                    <Col sm={11}>
                                    <Label htmlFor='email' sm={6}>링크</Label>
                                    <Input style={{color:"blue", cursor: "pointer", textDecoration: "underline"}} type='text' name='link' id='link' value={cokkiri.link} readOnly onClick={(e)=>{
                                        let link = cokkiri.link;
                                        if(link == null || link == '') {toastAlertWarning('링크가 비어있습니다.'); return;}
                                        if(link[0] != 'h')  link = 'http://'+ link;
                                        window.open(link, '_blank')
                                    }
                                    } />
                                    </Col>                            
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor='email' sm={6} style={{marginLeft:'55px'}}>파트별 현황</Label>
                                    <Table bordered={true} style={{width:"300px", marginLeft:'65px'}}>
                                        <thead>
                                            <tr>
                                            <th>파트 / 현황</th>
                                            <th>모집 인원</th>
                                            <th>남은 자리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cokkiri.projectParts.map((obj) => {
                                                
                                                return(
                                                    <tr key={obj.projectPartNo}>
                                                        <td>{obj.partName}</td>
                                                        <td>{obj.recruitCount}</td>
                                                        <td>{obj.recruitCount - obj.currentCount}</td>
                                                    </tr>
                                                )
                                            })}
                                        
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Form>
                        </div>
                        {(accessToken != '' && userId != cokkiri.writer.email) ?
                        <div className='project-dm-btn-gruop' style={{textAlign:'center', margin: '100px auto'}}>
                                <select name="" id="mealSelect" value={partNo} onChange={(e)=> {
                                    if (cokkiri.projectParts.find(obj => obj.partNo == e.target.value).recruitCount -
                                        cokkiri.projectParts.find(obj => obj.partNo == e.target.value).currentCount == 0) {
                                            toastAlertWarning('선택하신 파트는 현재 남은자리가 없습니다.'); 
                                        return;
                                    }
                                    setPartNo(e.target.value)
                                    setProjectPartNo(cokkiri.projectParts.find(obj => obj.partNo == e.target.value).projectPartNo)
                                }}
                                    style={{display:"inline", width:"110px", height:"30px", fontSize:"15px", marginTop:"3.5px", padding:"0px 20px 0px 12px"}}>
                                        {selectProjectParts.map((obj) => {
                                            return(
                                                <option value={obj.partNo} >{obj.partName}</option>
                                                
                                            )
                                        })}
                                </select>
                                &nbsp; &nbsp;
                                <Button color='primary' onClick={submit}>프로젝트 참여 DM 요청</Button>
                        </div> : <div/>}
                        
                    </div>
                </div>
            {/* 조회수 & 북마크기능 & 댓글카운트  */}
            <div style = {{width:'1200px', margin: '0px auto', display:"flex"}}>
                
                <div style = {{width:'50px', margin: '0px', display:"flex"}}>
                    <div onClick={toggle} ><BookmarkButton isBookmarked={isBookmarked} /></div>
                    &nbsp;{cokkiri.isBookMarkedCount}
                </div>
                <div style = {{width:'50px', margin: '0px', display:"flex"}}>
                    <div >👀</div>
                    &nbsp;{cokkiri.views}
                </div>
                
            </div>
        </div>
        )
}