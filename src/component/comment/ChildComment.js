/**
 * 무한반복 댓글을 위한 재귀호출 컴포넌트
 * @returns 
 */
import { useRef } from 'react';
import { Button } from 'reactstrap';
import * as  DateUtil from '../../util/DateUtil.js'
export default function ChildComment({ commentNo, writer, nickname, content, firstRegDate, children }) {
    /* 댓글영역 - TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const textarea = useRef('');
    const textInputaDiv = useRef('');
    const contentDiv = useRef('');
    const handleResizeHeight = () => {
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
    };

    const textAreaShow = () => {
        textInputaDiv.current.style.display ='block';
        contentDiv.current.style.display ='none';
    };
    const textAreaNone = () => {
        textInputaDiv.current.style.display ='none';
        contentDiv.current.style.display ='block';
        textarea.current.style.height = '55px';
        textarea.current.value = content;
    };

    return (
        <div>
        <div style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
            <div key={commentNo} style={{width:'1000px', margin:"30px auto"}}>
                <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                <div ref={contentDiv}>
                    <span>{nickname}</span> <span style={{color:'gray'}}>{firstRegDate}</span>
                    <div>
                        <p>{content}</p>
                    </div>
                    <span>{'댓글'}</span> <span onClick={textAreaShow} value='수정'>수정</span> <span>{'지우기'}</span>
                </div>
                <div ref={textInputaDiv} style={{display:'none', width:'900px', minHeight:'130px', margin:"0px auto", border: '0.1px solid lightgray'}}>
                    <div style={{paddingBottom:'30px'}}>
                        <div>
                            <textarea ref={textarea} onChange={handleResizeHeight} value={content}
                            style={{display:'inline', width:'858px', heigt:'55px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                        </div>
                        <div style={{float:'right', margin:'-16px 17px 0px 0px', paddingBottom:'10px'}}>
                            <Button outline size={'sm'} onClick={textAreaNone}>취소</Button> &nbsp;
                            <Button outline size={'sm'}>수정</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {children.map(child => (
            <ChildComment
                key={child.commentNo}
                writer={child.writer}
                nickname={child.writer.nickname}
                content={child.content}
                firstRegDate={DateUtil.utcToKrFull(child.firstRegDate)}
                children={child.children}
            />
            ))}

        </div>
    );
}