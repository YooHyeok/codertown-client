import { Button } from 'reactstrap';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import _ from 'lodash'; // Lodash 라이브러리
import { Link, useParams, useNavigate } from 'react-router-dom';
import ParentComment from '../comment/ParentComment.js'
import * as  DateUtil from '../../util/DateUtil.js'

export default function CoggleDetail() {
    const divStyle = {
        width: '100%' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };

    const [commentValue, setCommentValue] = useState('');

    const textarea = useRef('');

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
        console.log(coggleNo)
        const saveRequest = {coggleNo:coggleNo, content:commentValue, parentNo:null, writer:"yjou7454@gmail.com", depth:1}
        axios.post('/coggle/comment-save',saveRequest)
        .then((response)=>{
            if (response.data.success == true) commentSearchAxios(); //댓글 조회
        })
        .catch((error)=>{
            console.log(error);
        })
    };

    /**
     * 댓글 조회 메소드
     */
    const commentSearchAxios = () => {
        axios.get(`/coggle/${coggleNo}/comment`)
        .then((response)=> {
            setCommentList(response.data)
        })
        .catch((error) => {
            console.log(error);
        })
    }

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
        }
             )

    const [commentList, setCommentList] = useState([])

    useEffect(()=> {
        axios.get(`/coggle-detail/${coggleNo}`)
        .then((response)=> {
            setCoggle({  
                        title: response.data.title, 
                        writer: response.data.writer,
                        nickname: response.data.writer.nickname,
                        category : response.data.category,
                        categoryText: response.data.category == 'T' ? 'TechQue' : response.data.category == 'C' ? 'Carrier' :  'DevLife',
                        title: response.data.title,
                        content: response.data.content,
                        }
            )
        })
        .catch((error) => {
            console.log(error);
        })

        commentSearchAxios(); //댓글 조회
    },[])

    /* func - 삭제 기능 */
    const del = (e) => {
        alert("삭제 하시겠습니까?");

        const formData = new FormData();
        formData.append('coggleNo', coggleNo);

        axios.post('/coggle-delete', formData)
        .then((response)=> {
            document.location.href="/coggle";
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
                <div style = {{width:'1200px', margin: '50px auto', display:"flex", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{width:'1200px',margin:"30px 20px 10px 10px"}}>
                        <h3 ><b>{coggle.title}</b></h3>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{coggle.nickname}</span> <br/> <span>{'2023-08-21'}</span> <span>조회수 {'33'}</span>
                        </div>
                        <div className='update-delete-btn-gruop' style={{display:"flex", marginTop:"-40px", float:'right'}}>
                            <Button color='secondary' onClick={(e)=>{
                                navigate('/coggle-edit', { state: { coggleNo } });
                            }}>수정</Button>&nbsp;&nbsp;
                            <Button color='danger' onClick={del}>삭제</Button>
                        </div>
                    </div>
                </div>
                {/* 글 내용 */}
                <div style={{width:'1000px', height:'100%', margin :'0px auto'}}>
                    {/* 토스트 뷰어 영역 */}
                    <div style={{ width: '1000px', minHeight:'600px', margin:'10px'}}>
                        <Viewer className="toast-viewer" initialValue={coggle.content} key={coggle.content}/>
                    </div>
                    
                        {/* <Button color='secondary'>목록으로</Button> */}
                </div>
            {/* 댓글 영역 */}
            <div style = {{width:'1200px', margin: '30px auto', borderTop: '0.1px solid lightgray'}}>
            {/* 부모댓글 영역 - 반복추출 */}
            {commentList.map((parent) => {
                console.log(parent)
                return (
                        <ParentComment
                                key={parent.commentNo}
                                commentNo={parent.commentNo}
                                coggleNo={parent.coggleNo}
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
                                style={{display:'inline', width:'1058px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
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
