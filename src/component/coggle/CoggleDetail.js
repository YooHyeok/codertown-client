import { Button } from 'reactstrap';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import _ from 'lodash'; // Lodash 라이브러리
import { Link, useParams, useNavigate } from 'react-router-dom';
import ChildComment from '../comment/ChildComment.js'
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

    /* 댓글영역 - TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const textarea = useRef('');
    const handleResizeHeight = () => {
    textarea.current.style.height = 'auto';
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
    };

    /* [수정] 버튼 클릭시 글번호 파라미터 주소에 노출시키지 않고 history에 담아 처리 */
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

        axios.get(`/coggle/${coggleNo}/comment`)
        .then((response)=> {
            console.log(response.data)
            setCommentList(response.data)
            /* setCoggle({  
                        title: response.data.title, 
                        writer: response.data.writer,
                        nickname: response.data.writer.nickname,
                        category : response.data.category,
                        categoryText: response.data.category == 'T' ? 'TechQue' : response.data.category == 'C' ? 'Carrier' :  'DevLife',
                        title: response.data.title,
                        content: response.data.content,
                        }
            ) */
        })
        .catch((error) => {
            console.log(error);
        })
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
                /* options :  날짜-시간 포매팅 형식 */
                const options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true};
                const [ { value: month },, { value: day },, { value: year },, { value: hour },, { value: minute },, { value: dayPeriod } ]
                 = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date(parent.firstRegDate));
                const formattedTime = `${year}-${month}-${day}, ${hour}:${minute} ${dayPeriod}`;
                return (
                        <>
                        {/* <div key={parent.commentNo} style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
                            <div style={{width:'1100px', margin:"30px auto"}}>
                                <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                                <div>
                                    <span>{parent.writer.nickname}</span> <span style={{color:'gray'}}>
                                        {formattedTime}
                                    </span>
                                    <div>
                                        <p>{parent.content}</p>
                                    </div>
                                    <span>{'댓글'}</span> <span>{'수정'}</span> <span>{'지우기'}</span>
                                </div>
                            </div>
                        </div> */}
                        <ParentComment
                                key={parent.commentNo}
                                writer={parent.writer}
                                nickname={parent.writer.nickname}
                                content={parent.content}
                                firstRegDate={DateUtil.utcToKrFull(parent.firstRegDate)}
                                children={parent.children}
                                />
                        {/* 자식댓글 영역 - 반복추출 */}
                        {parent.children.map((child)=>{
                            console.log(child.firstRegDate)
                            return (
                            <ChildComment
                                key={child.commentNo}
                                writer={child.writer}
                                nickname={child.writer.nickname}
                                content={child.content}
                                firstRegDate={DateUtil.utcToKrFull(child.firstRegDate)}
                                children={child.children}
                                />)
                        })}
                    </>
                    )// 부모 JSX Render return문 종료
                })} 
                {/* 최상위 댓글 입력 영역 */}
                <div style={{width:'1100px', margin:"30px auto", border: '0.1px solid lightgray'}}>
                    <textarea ref={textarea} onChange={handleResizeHeight}
                    style={{width:'1060px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                </div>
            </div>
        </div>
        )
}
