import { useRef, useState } from 'react';
import { Button } from 'reactstrap';
import ChildComment from '../comment/ChildComment.js'
import * as  DateUtil from '../../util/DateUtil.js'
import axios from "axios";

/**
 * 무한반복 댓글을 위한 재귀호출 컴포넌트
 * @returns 
 */
export default function ParentComment({ commentNo, coggleNo, writer, nickname, content, firstRegDate, children, commentSearchAxios }) {
    
    /* 댓글영역 - TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const editTextarea = useRef('');
    const addTextarea = useRef('');
    const textEditDiv = useRef('');
    const textAddDiv = useRef('');
    const contentDiv = useRef('');
    const navigateDiv = useRef('');
    
    const [addCommentValue, setAddCommentValue] = useState('');
    const [editCommentValue, setEditCommentValue] = useState(content);

    const loginId = "webdevyoo@gmail.com";

    /* 댓글 [저장] */
    const submit = () => {
        console.log(coggleNo)
        const saveRequest = {coggleNo:coggleNo, content:addCommentValue, parentNo:commentNo, writer:loginId, depth:2, mentionUser: nickname}
        console.log(saveRequest)
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
        console.log(coggleNo)
        const saveRequest = {commentNo:commentNo, content:editCommentValue}
        console.log(saveRequest)
        axios.post('/coggle/comment-update',saveRequest)
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

    /* 댓글 [입력] Change 이벤트 메소드 */
    const textAreaInputChange = (e) => {
        // 추가 모드
        if(e.target.name == 'addTextarea') {
            addTextarea.current.style.height = 'auto';
            addTextarea.current.style.height = addTextarea.current.scrollHeight + 'px';
            setAddCommentValue(e.target.value)
            return;
        }
        // 수정 모드
        editTextarea.current.style.height = 'auto';
        editTextarea.current.style.height = editTextarea.current.scrollHeight + 'px';
        setEditCommentValue(e.target.value)
    };

    /* textarea를 활성화 시키고 네비 버튼 비활성화 */
    const textAreaShow = (e) => {
        // 추가 모드 - 네비 비활성화
        if(e.target.id == 'addSpan') {
            textAddDiv.current.style.display ='block';
            navigateDiv.current.style.display ='none';
            return
        }
        // 수정 모드 - 컨텐트(네비포함) 비활성화
        textEditDiv.current.style.display ='block';
        contentDiv.current.style.display ='none';
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
        <>
        <div key={commentNo} style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
            <div style={{width:'1100px', margin:"30px auto"}}>
                <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                <div ref={contentDiv} style={{display:'block'}}>
                    <span>{nickname}</span> <span style={{color:'gray'}}>{firstRegDate}</span>
                    <p style={{width:'1000px', margin:'0px 0px 0px 50px'}}>
                        <span dangerouslySetInnerHTML={{ __html: processedContent }}/>
                        <div ref={navigateDiv}>
                            <b>
                                <span style={{cursor: 'pointer'}} id='addSpan' onClick={textAreaShow}>댓글</span>&nbsp;&nbsp;
                                <span style={{cursor: 'pointer'}} id='editSpan' onClick={textAreaShow}>수정</span>&nbsp;&nbsp;
                                <span style={{cursor: 'pointer'}}>지우기</span>
                            </b>
                        </div>
                    </p>
                    {/* 최상위 댓글 추가 입력 영역 */}
                    <div ref={textAddDiv} style={{display:'none', width:'1100px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                        <div style={{paddingBottom:'30px'}}>
                            <div>
                                <textarea ref={addTextarea} name="addTextarea" value={addCommentValue} onChange={textAreaInputChange}
                                style={{display:'inline', width:'1058px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                            </div>
                            <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                                <Button outline size={'sm'} name="addCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                                <Button outline size={'sm'} onClick={submit}>저장</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 수정영역 */}
                <div ref={textEditDiv} style={{display:'none', width:'1000px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                    <div style={{paddingBottom:'30px'}}>
                        <div>
                            <textarea ref={editTextarea} name="editTextarea" value={editCommentValue} onChange={textAreaInputChange}
                            style={{display:'inline', width:'958px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                        </div>
                        <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                            <Button outline size={'sm'}  name="editCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                            <Button outline size={'sm'} onClick={update}>수정</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* 자식 댓글 컴포넌트 호출 */}
        {children.map((child)=>{
            console.log(child)
            console.log(child.writer.nickname)
            return (
            <ChildComment
                key={child.commentNo}
                commentNo={child.commentNo}
                coggleNo={coggleNo}
                writer={child.writer}
                nickname={child.writer.nickname}
                content={child.content}
                firstRegDate={DateUtil.utcToKrFull(child.firstRegDate)}
                children={child.children} // 재귀를 위한 Children
                parentNo={commentNo}
                mentionUser={child.mentionUser}
                commentSearchAxios={commentSearchAxios}
                />)
        })}
        </>
    );
}