import axios from "axios";
import { useState, useEffect } from 'react';

/**
 * 무한반복 댓글을 위한 재귀호출 컴포넌트
 * @returns 
 */
export default function ParentComment({ commentNo, writer, nickname, content, firstRegDate, children }) {

    useEffect(()=> {
    },[])
    return (
        <div key={commentNo} style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
            <div style={{width:'1100px', margin:"30px auto"}}>
                <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                <div>
                    <span>{writer.nickname}</span> <span style={{color:'gray'}}>
                        {firstRegDate}
                    </span>
                    <div>
                        <p>{content}</p>
                    </div>
                    <span>{'댓글'}</span> <span>{'수정'}</span> <span>{'지우기'}</span>
                </div>
            </div>
        </div>
    );
}