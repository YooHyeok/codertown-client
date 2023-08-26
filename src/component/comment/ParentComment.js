import { useEffect } from 'react';
import { useRef } from 'react';
import { Button } from 'reactstrap';
import ChildComment from '../comment/ChildComment.js'
import * as  DateUtil from '../../util/DateUtil.js'

/**
 * 무한반복 댓글을 위한 재귀호출 컴포넌트
 * @returns 
 */
export default function ParentComment({ commentNo, writer, nickname, content, firstRegDate, children }) {
    
    /* 댓글영역 - TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const editTextarea = useRef('');
    const addTextarea = useRef('');
    const textEditDiv = useRef('');
    const textAddDiv = useRef('');
    const contentDiv = useRef('');
    const navigateDiv = useRef('');

    /* textarea 사이즈 변경 */
    const resizeHeightControll = (e) => {
        // 추가 모드
        if(e.target.name == 'addTextarea') {
            addTextarea.current.style.height = 'auto';
            addTextarea.current.style.height = addTextarea.current.scrollHeight + 'px';
            return;
        }
        // 수정 모드
        editTextarea.current.style.height = 'auto';
        editTextarea.current.style.height = editTextarea.current.scrollHeight + 'px';
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
            textAddDiv.current.style.display ='none';
            navigateDiv.current.style.display ='block'; // 네비 활성화
            addTextarea.current.style.height = '55px';
            addTextarea.current.value = null;
            return;
        }
        // 수정 모드
        textEditDiv.current.style.display ='none';
        contentDiv.current.style.display ='block'; // 컨텐트(네비포함) 활성화
        editTextarea.current.style.height = '55px';
        editTextarea.current.value = content;
    };

    useEffect(()=> {
    },[])
    return (
        <>
        <div key={commentNo} style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
            <div style={{width:'1100px', margin:"30px auto"}}>
                <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                <div ref={contentDiv} style={{display:'block'}}>
                    <span>{nickname}</span> <span style={{color:'gray'}}>{firstRegDate}</span>
                    <div>
                        <p>{content}</p>
                    </div>
                    <div ref={navigateDiv}>
                        <span style={{cursor: 'pointer'}} id='addSpan' onClick={textAreaShow}>댓글</span>&nbsp;
                        <span style={{cursor: 'pointer'}} id='editSpan' onClick={textAreaShow}>수정</span>&nbsp;
                        <span style={{cursor: 'pointer'}}>지우기</span>
                    </div>
                    {/* 최상위 댓글 입력 영역 */}
                    <div ref={textAddDiv} style={{display:'none', width:'1100px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                        <div style={{paddingBottom:'30px'}}>
                            <div>
                                <textarea ref={addTextarea} name="addTextarea" onChange={resizeHeightControll}
                                style={{display:'inline', width:'1058px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                            </div>
                            <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                                <Button outline size={'sm'} name="addCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                                <Button outline size={'sm'}>저장</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 수정영역 */}
                <div ref={textEditDiv} style={{display:'none', width:'1000px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                    <div style={{paddingBottom:'30px'}}>
                        <div>
                            <textarea ref={editTextarea} name="editTextarea" onChange={resizeHeightControll}
                            style={{display:'inline', width:'958px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                        </div>
                        <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                            <Button outline size={'sm'}  name="editCancelBtn" onClick={textAreaNone}>취소</Button> &nbsp;
                            <Button outline size={'sm'}>수정</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* 자식 댓글 컴포넌트 호출 */}
        {children.map((child)=>{
            return (
            <ChildComment
                key={child.commentNo}
                writer={child.writer}
                nickname={child.writer.nickname}
                content={child.content}
                firstRegDate={DateUtil.utcToKrFull(child.firstRegDate)}
                children={child.children}
                parentNickname={nickname}
                />)
        })}
        </>
    );
}