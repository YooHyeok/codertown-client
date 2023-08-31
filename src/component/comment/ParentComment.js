import { useRef, useState } from 'react';
import { Button } from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import ChildComment from '../comment/ChildComment.js'
import * as  DateUtil from '../../util/DateUtil.js'
import axios from "axios";

/**
 * 무한반복 댓글을 위한 재귀호출 컴포넌트
 * @returns 
 */
export default function ParentComment({ commentNo, status, coggleNo,coggleWriter, writer, nickname, content, firstRegDate, children, commentSearchAxios }) {
    
    /* 댓글영역 - TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const editTextareaRef = useRef('');
    const addTextareaRef = useRef('');
    const textEditDivRef = useRef('');
    const textAddDivRef = useRef('');
    const contentDivRef = useRef('');
    const naviDivRef = useRef('');
    
    const [addCommentValue, setAddCommentValue] = useState('');
    const [editCommentValue, setEditCommentValue] = useState(content);

    const userId = useSelector( (state) => {return state.UserId} );

    /* 댓글 [저장] */
    const submit = () => {
        const saveRequest = {coggleNo:coggleNo, content:addCommentValue, parentNo:commentNo, writer:userId, depth:2, mentionUser: nickname}
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
            resizeTextArea(addTextareaRef);
            setAddCommentValue(e.target.value)
            return;
        }
        // 수정 모드
        resizeTextArea(editTextareaRef);
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
        // 추가 모드 - 네비 비활성화
        if(e.target.id == 'addSpan') {
            textAddDivRef.current.style.display ='block';
            naviDivRef.current.style.display ='none';
            return
        }
        // 수정 모드 - 컨텐트(네비포함) 비활성화
        textEditDivRef.current.style.display ='block';
        contentDivRef.current.style.display ='none';
        resizeTextArea(editTextareaRef); // [수정] 버튼 클릭후 value값에 맞춰 텍스트아리아 높이 조정
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
        textAddDivRef.current.style.display ='none';
        naviDivRef.current.style.display ='block'; // 네비 활성화
        addTextareaRef.current.style.height = '55px';
        addTextareaRef.current.value = null;
    }

    /**
     * 수정영역 텍스트아리아 OFF 메소드
     */
    const editTeatAreaOff = () => {
        textEditDivRef.current.style.display ='none';
        contentDivRef.current.style.display ='block'; // 컨텐트(네비포함) 활성화
        editTextareaRef.current.style.height = '55px';
        editTextareaRef.current.value = content;
    }

    const processedContent = content.replace(/\n/g, '<br>');
    return (
        <>
        <div key={commentNo} style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
            { (status == true) && <div style={{width:'1100px', margin:"30px auto"}}>' 댓글이 삭제/블라인드 처리 되었습니다 '</div>}
            { (status == false) && 
            <div style={{width:'1100px', margin:"30px auto"}}>
                <img style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}} className="profile" src={`/profileImage/${writer.email}`} alt="profile"/>
                <div ref={contentDivRef} style={{display:'block'}}>
                    {coggleWriter.email == writer.email && 
                    <span style={{color:'gray'}}>[작성자] </span>} 
                    <span>{nickname} </span>
                    <span style={{color:'gray'}}>{firstRegDate}</span>
                    <div style={{width:'1000px', margin:'0px 0px 0px 50px'}}>
                        <span dangerouslySetInnerHTML={{ __html: processedContent }}/>
                        <div ref={naviDivRef}>
                            <b>
                                <span style={{cursor: 'pointer'}} id='addSpan' onClick={textAreaShow}>댓글</span>&nbsp;&nbsp;
                                {userId == writer.email && 
                                <><span style={{cursor: 'pointer'}} id='editSpan' onClick={textAreaShow}>수정</span>&nbsp;&nbsp;
                                <span style={{cursor: 'pointer'}} onClick={del} >지우기</span></>}
                            </b>
                        </div>
                    </div>
                    {/* 최상위 댓글 추가 입력 영역 */}
                    <div ref={textAddDivRef} style={{display:'none', width:'1100px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                        <div style={{paddingBottom:'30px'}}>
                            <div>
                                <textarea ref={addTextareaRef} name="addTextarea" value={addCommentValue} onChange={textAreaInputChange}
                                style={{display:'inline', width:'1058px', heigt:'55px', margin:"20px", resize: 'none', outlineStyle:'none', overflow:'hidden', border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                            </div>
                            <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                                <Button outline size={'sm'} name="addCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                                <Button outline size={'sm'} onClick={submit}>저장</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 최상위 댓글 수정 입력 영역 */}
                <div ref={textEditDivRef} style={{display:'none', width:'1050px', minHeight:'130px', margin:"0px auto", marginLeft:'50px', border: '0.1px solid lightgray'}}>
                    <div style={{paddingBottom:'30px'}}>
                        <div>
                            <textarea ref={editTextareaRef} name="editTextareaRef" value={editCommentValue} onChange={textAreaInputChange}
                            style={{display:'inline', width:'1008px', heigt:'55px', margin:"20px", resize: 'none', outlineStyle:'none', overflow:'hidden', border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                        </div>
                        <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                            <Button outline size={'sm'}  name="editCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                            <Button outline size={'sm'} onClick={update}>수정</Button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
        {/* 자식 댓글 컴포넌트 호출 */}
        {children.map((child)=>{
            return (
            <ChildComment
                key={child.commentNo}
                commentNo={child.commentNo}
                coggleNo={coggleNo}
                coggleWriter={coggleWriter}
                writer={child.writer}
                nickname={child.writer.nickname}
                content={child.content}
                firstRegDate={DateUtil.utcToKrFull(child.firstRegDate)}
                children={child.children} // 재귀를 위한 Children
                parentNo={commentNo}
                mentionUser={child.mentionUser}
                status={child.status}
                commentSearchAxios={commentSearchAxios}
                />)
        })}
        </>
    );
}