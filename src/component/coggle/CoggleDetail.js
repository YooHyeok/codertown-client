import { Button } from 'reactstrap';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import _ from 'lodash'; // Lodash 라이브러리

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

    /* TextArea 개행 추가 및 제거 시 영역 확장 축소 */
    const textarea = useRef('');
    const handleResizeHeight = () => {
    textarea.current.style.height = 'auto';
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
    };

    const [cokkiri, setCokkiri] = useState(
        {   
            title: null,
            writer: {},
            nickname: "fghij",
            content: "updatevalue",
            link: "updatevalue",
            objectWeek: 4,
            subject: "abcde",
            teamName: "fghij",
            projectParts: []
        }
             )

    useEffect(()=> {
        axios.get('/cokkiri-detail/2')
        .then((response)=> {
            console.log(response.data);
            setCokkiri({...cokkiri,     
                        title: response.data.cokkiriDto.title, 
                        writer: response.data.cokkiriDto.writer,
                        nickname: response.data.cokkiriDto.writer.nickname,
                        content: response.data.cokkiriDto.content,
                        link: response.data.cokkiriDto.link,
                        objectWeek: response.data.cokkiriDto.objectWeek,
                        subject: response.data.projectDto.subject,
                        teamName: response.data.projectDto.teamName,
                        projectParts: response.data.projectDto.projectParts
                        }
                                    
            )
            console.log(cokkiri)
        })
        .catch((error) => {
            console.log(error);
        })
    },[])

    return(
        <div style={divStyle}>
                <div style = {{width:'1200px', margin: '0px auto', borderBottom: '0px solid lightgray'}}>
                    <div style={{width:'220px', margin: '0px auto', display:"flex"}}>
                        <h1 style={{margin:"30px auto"}}><b>코글</b></h1>
                        <h6 style={{width:'130px',margin:"50px auto"}}>devlife</h6>
                    </div>
                </div>
                {/* 글 제목 */}
                <div style = {{width:'1200px', margin: '50px auto', display:"flex", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{width:'1200px',margin:"30px 20px 10px 10px"}}>
                        <h3 ><b>{cokkiri.title}</b></h3>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{cokkiri.nickname}</span> <br/> <span>{'2023-08-21'}</span> <span>조회수 {'33'}</span>
                        </div>
                        <div className='update-delete-btn-gruop' style={{display:"flex", marginTop:"-40px", float:'right'}}>
                            <Button color='secondary'>수정</Button>&nbsp;&nbsp;
                            <Button color='danger'>삭제</Button>
                        </div>
                    </div>
                </div>
                {/* 글 내용 */}
                <div style={{width:'1000px', height:'100%', margin :'0px auto'}}>
                    {/* 토스트 뷰어 영역 */}
                    <div style={{ width: '1000px', minHeight:'600px', margin:'10px'}}>
                        <Viewer className="toast-viewer" initialValue={cokkiri.content} key={cokkiri.content}/>
                    </div>
                    
                        {/* <Button color='secondary'>목록으로</Button> */}
                </div>
            {/* 댓글 영역 */}
            <div style = {{width:'1200px', margin: '30px auto', borderTop: '0.1px solid lightgray'}}>
                {/* 최상위 댓글 출력 영역 */}
                <div style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{width:'1100px', margin:"30px auto"}}>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{'유혁스쿨'}</span> <span>{'2023-08-21'}</span>
                            <div>
                                <p>asdasdasdasdasd</p>
                            </div>
                            <span>{'댓글'}</span> <span>{'수정'}</span> <span>{'지우기'}</span>
                        </div>
                    </div>
                </div>
                {/* 자식 댓글 출력 영역 */}
                <div style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{width:'1000px', margin:"30px auto"}}>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{'유혁스쿨'}</span> <span>{'2023-08-21'}</span>
                            <div>
                                <p>asdasdasdasdasd</p>
                            </div>
                            <span>{'댓글'}</span> <span>{'수정'}</span> <span>{'지우기'}</span>
                        </div>
                    </div>
                </div>
                {/* 최상위 댓글 출력 영역 */}
                <div style={{width:'1100px', margin:"30px auto", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{width:'1100px', margin:"30px auto"}}>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{'유혁스쿨'}</span> <span>{'2023-08-21'}</span>
                            <div>
                                <p>asdasdasdasdasd</p>
                            </div>
                            <span>{'댓글'}</span> <span>{'수정'}</span> <span>{'지우기'}</span>
                        </div>
                    </div>
                </div>
                {/* 최상위 댓글 입력 영역 */}
                <div style={{width:'1100px', margin:"30px auto", border: '0.1px solid lightgray'}}>
                    <textarea ref={textarea} onChange={handleResizeHeight}
                    style={{width:'1060px', margin:"20px", border: '0.1px solid lightgray'}} placeholder='댓글 내용을 입력하세요'/>
                </div>
                
            </div>
        </div>
        )
}
