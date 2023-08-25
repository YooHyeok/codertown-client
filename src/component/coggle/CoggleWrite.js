import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, createContext, useEffect } from 'react';
import ToastEditor from '../ToastEditor.js'
import axios from "axios";

export const CoggleWriteContext = createContext();
export default function CoggleWrite() {
    const divStyle = {
        width: '950px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };
      const navigate = useNavigate();

    const [toastHtml, setToastHtml] = useState('');
    const [toastMarkdown, setMarkdown] = useState('');
    const context = {
        setToastHtml: setToastHtml.bind(this),
        setMarkdown: setMarkdown.bind(this)
    }

    /* state - 코글 저장 객체 */
    const [coggle, setCoggle] = useState({
        writer: 'webdevyoo@gmail.com', //로그인 한 사용자 계정
        category: 'T', //페이지 첫 진입  TechQue 기본값 T이다.
        title: '',
        content: '',
    })

    /* func - select/input란 데이터 변경 함수 */
    const initChange = (e) => {
        setCoggle({...coggle, [e.target.name] : e.target.value})
    }

    /* 저장 - onclick 이벤트 종료시점 리랜더링 Flag  */
    const [reRenderFlag, setReRenderFlag] = useState(false);
    
    /* func - 저장 기능 */
    const submit = () => {
        setCoggle({...coggle, content : toastHtml});
        alert("저장 하시겠습니까?");
        setReRenderFlag(true);
    }

    /**
     * 컴포넌트 리렌더링 후에 axios를 호출한다.
     * 저장버튼이 클릭되고 Event가 종료되는 시점
     * 즉, 리랜더링 되는 시점에 호스트 서버와 통신한다.
     * 누적되어 있던 state 변경내역들 실제 적용된다.
     */
    useEffect(() => {
        if (reRenderFlag) {
        // axios 호출
            axios.post('/coggle-save', coggle)
            .then((response)=> {
                document.location.href='/coggle'
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [reRenderFlag]);

    return(
        <div style={divStyle}>
                <div style = {{display:"flex"}}>
                    <div>
                        <h1 style={{margin:"30px 20px 30px 10px"}}><b>코글</b></h1>
                    </div>
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        글쓰기
                    </div>
                </div>
                {/* 입력 폼 영역 */}
                <div style={{width:"900px", height:"850px", margin:"0px auto", border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                    <Form style={{width:"824px", height:"850px", margin:"30px auto"}}>
                        <FormGroup row >
                            <Col sm={2}>
                            <Label style={{width:"95px"}} htmlFor='category' sm={2}>카테고리</Label>
                            <select name="category" id="category" onChange={initChange}
                                style={{display:"inline", width:"110px", height:"30px", fontSize:"15px", marginTop:"3.5px", padding:"0px 20px 0px 12px"}}>
                                <option value={"T"} >TechQue</option>
                                <option value={"C"} >Carrier</option>
                                <option value={"D"} >DevLife</option>
                            </select>
                            </Col>
                            <Col sm={10}>
                            <Label style={{width:"95px"}} htmlFor='title' sm={2}>제목</Label>
                                <Input type='text' name='title' id='title' onChange={initChange}/>
                            </Col>
                            
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='password2' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                {/* <Input type='textarea' name='password2' id='password' 
                                style={{width:"730px", height:"500px", overflow: "auto"}}/> */}
                                <CoggleWriteContext.Provider value={context} >
                                    <ToastEditor props={{mode:'write'}}/>
                                </CoggleWriteContext.Provider>
                                <br/>
                                <div style={{float:"right"}} >
                                <Button color='secondary' outline onClick={(e)=>{e.preventDefault(); navigate(-1);}}>취소</Button>&nbsp;&nbsp;
                                <Button color='secondary' onClick={submit}>저장</Button>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
        </div>
        )
}