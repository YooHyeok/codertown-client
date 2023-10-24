import { Button } from 'reactstrap';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import _ from 'lodash'; // Lodash 라이브러리
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import ParentComment from '../comment/ParentComment.js'
import * as  DateUtil from '../../util/DateUtil.js'
import LikeMarkButton from '../button/LikeMarkButton.js';
import useToast from '../../hook/useToast.js';
import { confirmAlert } from "react-confirm-alert"; // npm install react-confirm-alert --save --force

export default function CoggleDetail() {
    const { toastAlertWarning, toastAlertSuccess } = useToast();

    const divStyle = {
        width: '100%' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };

    const userId = useSelector( (state) => {return state.UserId} );
    const location = useLocation(); // state를 위한 location
    const [src, setSrc] = useState('/default_profile.png')
    const [commentValue, setCommentValue] = useState('');
    const textarea = useRef('');

    /* 본문 [수정] - 글번호 파라미터 주소에 노출시키지 않고 history에 담아 처리 */
    const navigate = useNavigate();
    const { coggleNo } = useParams();

    const [coggle, setCoggle] = useState(
        {   
            title: null,
            writer: {},
            nickname: '',
            category: 'T', //페이지 첫 진입  TechQue 기본값 T이다.
            content: '',
            isLikeMarked: false,
            isLikedMarkedCount: 0,
            views: 0
        }
                )


    useEffect(()=> {
        axios.get(`/coggle-detail/${coggleNo}/${userId == '' ? null : userId}`)
        .then((response)=> {
            setCoggle({  
                        title: response.data.title, 
                        writer: response.data.writer,
                        nickname: response.data.writer.nickname,
                        category : response.data.category,
                        categoryText: response.data.category == 'T' ? 'TechQue' : response.data.category == 'C' ? 'Carrier' :  'DevLife',
                        title: response.data.title,
                        content: response.data.content,
                        isLikeMarked: response.data.isLikeMarked,
                        isLikedMarkedCount: response.data.isLikedMarkedCount,
                        views: response.data.views
                        }
            )
            setSrc(`data:image/png;base64,${response.data.writer.profileUrl}`)
            setIsLikeMarked(response.data.isLikeMarked)

        })
        .catch((error) => {
            console.log(error);
        })
        commentSearchAxios(); //댓글 조회
    },[])


    /* 북마크 토글 */
    const [isLikeMarked, setIsLikeMarked] = useState(coggle.isLikeMarked)

    const toggle = (e) => {
        if (userId == '') {
        toastAlertWarning('북마크 기능을 이용하시려면 로그인이 필요합니다.');
        return;}
        const formData = new FormData();
        formData.append('coggleNo', coggleNo);
        formData.append('userId', userId);
    
        axios.post('/coggle-likemark-toggle', formData)
        .then((response) => {
            toastAlertSuccess(response.data.success ? "좋아요 목록에 추가되었습니다." : "좋아요 해제 되었습니다.")
            setIsLikeMarked(response.data.success)
            response.data.success ?  setCoggle({...coggle, isLikedMarkedCount: coggle.isLikedMarkedCount+1}): setCoggle({...coggle, isLikedMarkedCount: coggle.isLikedMarkedCount-1})

        })
        .catch((error) => {
            console.log(error);
        })
        // setCoggle({...coggle, isLikeMarked : !coggle.isLikeMarked})
    }

    /* func - 삭제 기능 */
    const del = (e) => {
        confirmAlert({
            title: '코글 삭제 확인',
            message: '삭제 하시겠습니까?',
            buttons: [
              {
                label: "확인",
                onClick: () => {
                    
        const formData = new FormData();
        formData.append('coggleNo', coggleNo);

        axios.post('/coggle-delete', formData)
        .then((response)=> {
            document.location.href="/coggle";
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

    /* 댓글 [입력] - TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const textAreaInputChange = (e) => {
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
        setCommentValue(e.target.value);
    };

    /* 댓글 [취소] - TextArea 취소버튼 클릭시 초기화 */
    const cancel = () => {
        textarea.current.style.height = '55px';
        textarea.current.value = null;
        setCommentValue(null);
    };

    /* 댓글 [저장] - 저장 후 재조회 */
    const submit = () => {
        if (userId == '') {
            toastAlertWarning("댓글을 작성하기 위해서는 로그인을 해주세요.")
            return;
        }
        const saveRequest = {coggleNo:coggleNo, content:commentValue, parentNo:null, writer:userId, depth:1}
        axios.post('/coggle/comment-save',saveRequest)
        .then((response)=>{
            if (response.data.success == true) {
                cancel();
                commentSearchAxios(); //댓글 조회
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    };
        
    const [commentList, setCommentList] = useState([])
    const [commentTotalCount, setCommentTotalCount] = useState([])

    /**
     * 댓글 조회 메소드
     */
    const commentSearchAxios = () => {
        axios.get(`/coggle/${coggleNo}/comment`)
        .then((response)=> {
            /* 댓글 초기화 */
            setCommentList(response.data)

            /* 댓글 토탈 카운트 초기화 */
            var childCommnetSumCount = 0;
            response.data.forEach(obj => childCommnetSumCount += obj.children.length)
            setCommentTotalCount(response.data.length+childCommnetSumCount);
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    return(
        <div style={divStyle}>
            <div style = {{width:'1200px', margin: '0px auto', borderBottom: '0px solid lightgray'}}>
                <div style={{width:'220px', margin: '0px auto', display:"flex"}}>
                    <h1 style={{margin:"30px auto"}}><b>코글</b></h1>
                    <h6 style={{width:'130px',margin:"50px auto"}}>{coggle.categoryText}</h6>
                </div>
            </div>
            {/* 글 제목 */}
            <div style = {{width:'1200px', margin: '0px auto', display:"flex", borderBottom: '0.1px solid lightgray'}}>
                <div style={{width:'1200px',margin:"30px 20px 10px 10px"}}>
                    <h5><b>{coggle.title}</b></h5>                            
                    <img style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}} className="profile" src={src} alt="profile"/>
                    <div>
                        <span>{coggle.nickname}</span> <br/> <span>{'2023-08-21'}</span> <span>조회수 {coggle.views}</span>
                    </div>
                    {/* 수정 삭제 버튼 */}
                    {userId == coggle.writer.email && 
                    <div className='update-delete-btn-gruop' style={{display:"flex", marginTop:"-40px", float:'right'}}>
                        <Button color='secondary' onClick={(e)=>{
                            navigate('/coggle-edit', { state: { coggleNo } });
                        }}>수정</Button>&nbsp;&nbsp;
                        <Button color='danger' onClick={del}>삭제</Button>
                    </div>}
                </div>
            </div>
            {/* 글 내용 */}
            <div style={{width:'1000px', margin :'0px auto', minHeight:'535px'}}>
                {/* 토스트 뷰어 영역 */}
                <div style={{ width: '1000px', margin:'10px',}}>
                    <Viewer className="toast-viewer" initialValue={coggle.content} key={coggle.content}/>
                </div>
            </div>
            {/* 조회수 & 좋아요기능 & 댓글카운트  */}
            <div style = {{width:'1200px', margin: '0px auto', display:"flex"}}>
                
                <div style = {{width:'50px', margin: '0px', display:"flex"}}>
                    <div onClick={toggle} ><LikeMarkButton isLikeMarked={isLikeMarked} className='inline' /></div>
                    &nbsp;{coggle.isLikedMarkedCount}
                </div>
                <div style = {{width:'50px', margin: '0px', display:"flex"}}>
                    <div >👀</div>
                    &nbsp;{coggle.views}
                </div>
                <div style = {{width:'50px', margin: '0px', display:"flex"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-text" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                        <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    &nbsp;{commentTotalCount}
                </div>
            </div>
            {/* 댓글 영역 */}
            <div style = {{width:'1200px', margin: '30px auto', borderTop: '0.1px solid lightgray'}}>
            {/* 부모댓글 영역 - 반복추출 */}
            {commentList.map((parent) => {
                return (
                        <ParentComment
                                key={parent.commentNo}
                                state={location.state}
                                commentNo={parent.commentNo}
                                status={parent.status}
                                coggleNo={parent.coggleNo}
                                coggleWriter={coggle.writer}
                                writer={parent.writer}
                                nickname={parent.writer.nickname}
                                content={parent.content}
                                firstRegDate={DateUtil.utcToKrFull(parent.firstRegDate)}
                                children={parent.children}
                                commentSearchAxios={commentSearchAxios}
                                />
                    )// 부모 JSX Render return문 종료
                })} 
                {/* 최상위 댓글 입력 영역 */}
                <div style={{display:'block', width:'1100px', minHeight:'130px', margin:"30px auto", border: '0.1px solid lightgray'}}>
                        <div style={{paddingBottom:'30px'}}>
                            <div>
                                <textarea ref={textarea} value={commentValue} onChange={textAreaInputChange}
                                style={{display:'inline', width:'1058px', heigt:'55px', margin:"20px", resize: 'none', outlineStyle:'none', overflow:'hidden',  border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                            </div>
                            <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                                <Button outline size={'sm'} onClick={cancel}>취소</Button> &nbsp;
                                <Button outline size={'sm'} onClick={submit}>저장</Button>
                            </div>
                        </div>
                    </div>
                {/* <div style={{width:'1100px', margin:"30px auto", border: '0.1px solid lightgray'}}>
                    <textarea ref={textarea} onChange={handleResizeHeight}
                    style={{width:'1060px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                </div> */}
            </div>
        </div>
        )
}
