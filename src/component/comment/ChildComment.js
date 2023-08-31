/**
 * 무한반복 댓글을 위한 재귀호출 컴포넌트
 * @returns 
 */
import { useRef, useState } from 'react';
import { Button } from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

import * as  DateUtil from '../../util/DateUtil.js'
import axios from "axios";

export default function ChildComment({ commentNo, coggleNo, coggleWriter, writer, nickname, content, firstRegDate, children, parentNo, mentionUser, status, commentSearchAxios }) {
    
    /* 댓글영역 - TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const editTextarea = useRef('');
    const addTextarea = useRef('');
    const textEditDiv = useRef('');
    const textAddDiv = useRef('');
    const contentDiv = useRef('');
    const navigateDiv = useRef('');


    const [addCommentValue, setAddCommentValue] = useState('');
    const [editCommentValue, setEditCommentValue] = useState(content);

    const userId = useSelector( (state) => {return state.UserId} );

    /* 댓글 [저장] */
    const submit = () => {
        const saveRequest = {coggleNo:coggleNo, content:addCommentValue, parentNo:parentNo, writer:userId, depth:3, mentionUser: nickname}
        axios.post('/coggle/comment-save',saveRequest)
        .then((response)=>{
            if (response.data.success == true) {
                addTeatAreaOff(); // 추가영역 TextArea OFF
                commentSearchAxios(); //댓글 조회
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    };

    /* 댓글 [수정] */
    const update = () => {
        const updateRequest = {commentNo:commentNo, content:editCommentValue}
        axios.post('/coggle/comment-update',updateRequest)
        .then((response)=>{
            if (response.data.success == true) {
                editTeatAreaOff(); // 수정영역 TextArea OFF
                commentSearchAxios(); //댓글 조회
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    };

    /* 댓글 [삭제] */
    const del= () => {
        const deleteRequest = {commentNo:commentNo}
        axios.post('/coggle/comment-delete',deleteRequest)
        .then((response)=>{
            if (response.data.success == true) {
                commentSearchAxios(); //댓글 조회
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    };

    /* 댓글 [입력] Change 이벤트 메소드 */
    const textAreaInputChange = (e) => {
        // 추가 모드
        if(e.target.name == 'addTextarea') {
            resizeTextArea(addTextarea);
            setAddCommentValue(e.target.value)
            return;
        }
        // 수정 모드
        resizeTextArea(editTextarea);
        setEditCommentValue(e.target.value)
    };

    /**
     * 텍스트아리아 높이 맞춤
     * @param {*} ref 
     */
    const resizeTextArea = (ref) => {
        ref.current.style.height = 'auto';
        ref.current.style.height = ref.current.scrollHeight + 'px';
    }
        
    /* textarea를 활성화 시키고 네비 버튼 비활성화 */
    const textAreaShow = (e) => {
        if (userId == '') {
            alert('댓글을 작성하기 위해서는 로그인을 해주세요.')
            return;
        }
        
        // 추가 모드 - 네비 비활성화
        if(e.target.id == 'addSpan') {
            textAddDiv.current.style.display ='block';
            navigateDiv.current.style.display ='none';
            return
        }
        // 수정 모드 - 컨텐트(네비포함) 비활성화
        textEditDiv.current.style.display ='block';
        contentDiv.current.style.display ='none';
        resizeTextArea(editTextarea); // [수정] 버튼 클릭후 value값에 맞춰 텍스트아리아 높이 조정

    };

    /* textarea내용 초기화 및 비활성화 시키고 네비 버튼 활성화 */
    const textAreaNone = (e) => {
        // 추가 모드
        if(e.target.name == 'addCancelBtn') {
            addTeatAreaOff(); // 추가영역 텍스트아리아 OFF
            return;
        }
        // 수정 모드
        editTeatAreaOff();
    };

    /**
     * 추가영역 텍스트아리아 OFF 메소드
     */
    const addTeatAreaOff = () => {
        textAddDiv.current.style.display ='none';
        navigateDiv.current.style.display ='block'; // 네비 활성화
        addTextarea.current.style.height = '55px';
        addTextarea.current.value = null;
    }

    /**
     * 수정영역 텍스트아리아 OFF 메소드
     */
    const editTeatAreaOff = () => {
        textEditDiv.current.style.display ='none';
        contentDiv.current.style.display ='block'; // 컨텐트(네비포함) 활성화
        editTextarea.current.style.height = '55px';
        editTextarea.current.value = content;
    }
    const processedContent = content.replace(/\n/g, '<br>');
    return (
        <div>
        <div style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
            { (status == true) && <div style={{width:'1000px', margin:"30px auto"}}>' 댓글이 삭제/블라인드 처리 되었습니다 '</div>}
            { (status == false) && 
            <div key={commentNo} style={{width:'1000px', margin:"30px auto"}}>
                <img style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}} className="profile" src={`/profileImage/${writer.email}`} alt="profile"/>
                <div ref={contentDiv}>
                    {coggleWriter.email == writer.email && 
                    <span style={{color:'gray'}}>[작성자] </span>} 
                    <span>{nickname} </span>
                    <span style={{color:'gray'}}>{firstRegDate}</span>
                    <div>
                        <div style={{width:'1000px', margin:'0px 0px 0px 50px'}}>
                            <span style={{color:'gray'}}>@{mentionUser} </span>
                            <span dangerouslySetInnerHTML={{ __html: processedContent }}/>
                            <div ref={navigateDiv}>
                                <b>
                                    <span style={{cursor: 'pointer'}} id='addSpan' onClick={textAreaShow}>댓글</span>&nbsp;
                                    {userId == writer.email && 
                                    <>
                                        <span style={{cursor: 'pointer'}} id='editSpan' onClick={textAreaShow} value='수정'>수정</span>&nbsp;
                                        <span style={{cursor: 'pointer'}} onClick={del} >지우기</span>
                                    </>}
                                </b>
                            </div>
                        </div>
                    </div>
                    {/* 하위 댓글 추가 입력 영역 */}
                    <div ref={textAddDiv} style={{display:'none', width:'1050px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                        <div style={{paddingBottom:'30px'}}>
                            <div>
                                <textarea ref={addTextarea} name="addTextarea" value={addCommentValue} onChange={textAreaInputChange}
                                style={{display:'inline', width:'1008px', heigt:'55px', margin:"20px", resize: 'none', outlineStyle:'none', overflow:'hidden', border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                            </div>
                            <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                                <Button outline size={'sm'} name="addCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                                <Button outline size={'sm'} onClick={submit}>저장</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 하위댓글 수정 입력 영역 */}
                <div ref={textEditDiv} style={{display:'none', width:'1000px', minHeight:'130px', margin:"0px auto", marginLeft:'50px', border: '0.1px solid lightgray'}}>
                    <div style={{paddingBottom:'30px'}}>
                        <div>
                            <textarea ref={editTextarea} name="editTextarea" value={editCommentValue} onChange={textAreaInputChange}
                            style={{display:'inline', width:'958px', heigt:'55px', margin:"20px", resize: 'none', outlineStyle:'none', overflow:'hidden', border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                        </div>
                        <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                            <Button outline size={'sm'} name="editCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                            <Button outline size={'sm'} onClick={update}>수정</Button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
        {/* 자식 댓글 컴포넌트 재귀 호출 */}
        {children.map(child => (
            <ChildComment
                key={child.commentNo}
                commentNo={child.commentNo}
                coggleNo={coggleNo}
                writer={child.writer}
                nickname={child.writer.nickname}
                content={child.content}
                firstRegDate={DateUtil.utcToKrFull(child.firstRegDate)}
                children={child.children}
                parentNo={coggleNo}
                mentionUser={nickname}
                status={child.status}
                commentSearchAxios={commentSearchAxios}
            />
            ))}

        </div>
    );
}