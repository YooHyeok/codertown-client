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
    const addResizeHeight = () => {
        console.log("응")
        addTextarea.current.style.height = 'auto';
        addTextarea.current.style.height = addTextarea.current.scrollHeight + 'px';
    };
    const editResizeHeight = () => {
        console.log("응")
        editTextarea.current.style.height = 'auto';
        editTextarea.current.style.height = editTextarea.current.scrollHeight + 'px';
    };

    const editTextAreaShow = () => {
        textEditDiv.current.style.display ='block';
        contentDiv.current.style.display ='none';
    };
    const editTextAreaNone = () => {
        textEditDiv.current.style.display ='none';
        contentDiv.current.style.display ='block';
        editTextarea.current.style.height = '55px';
        editTextarea.current.value = content;
    };
    const addTextAreaShow = () => {
        textAddDiv.current.style.display ='block';
    };
    const addTextAreaNone = () => {
        textAddDiv.current.style.display ='none';
        addTextarea.current.style.height = '55px';
        addTextarea.current.value = null;
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
                    <div>
                    <span style={{cursor: 'pointer'}} onClick={addTextAreaShow}>댓글 </span>
                    <span style={{cursor: 'pointer'}} onClick={editTextAreaShow}> 수정 </span>
                    <span style={{cursor: 'pointer'}}> 지우기</span>
                    </div>
                    {/* 최상위 댓글 입력 영역 */}
                    <div ref={textAddDiv} style={{display:'none', width:'1100px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                        <div style={{paddingBottom:'30px'}}>
                            <div>
                                <textarea ref={addTextarea} onChange={addResizeHeight}
                                style={{display:'inline', width:'1058px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                            </div>
                            <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                                <Button outline size={'sm'} onClick={addTextAreaNone}>취소</Button> &nbsp;
                                <Button outline size={'sm'}>저장</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 수정영역 */}
                <div ref={textEditDiv} style={{display:'none', width:'1000px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                    <div style={{paddingBottom:'30px'}}>
                        <div>
                            <textarea ref={editTextarea} onChange={editResizeHeight}
                            style={{display:'inline', width:'958px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                        </div>
                        <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                            <Button outline size={'sm'} onClick={editTextAreaNone}>취소</Button> &nbsp;
                            <Button outline size={'sm'}>수정</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* 자식 댓글 컴포넌트 호출 */}
        {children.map((child)=>{
            console.log(child.firstRegDate)
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