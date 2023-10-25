import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input } from 'reactstrap';
import { useState, createContext, useEffect } from 'react';
import ToastEditor from '../ToastEditor.js'
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // npm install react-confirm-alert --save --force

export const CoggleEditContext = createContext();
export default function CoggleEdit() {

    const bodyStyle = {
        width: '950px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };

    const navigate = useNavigate();
    const location = useLocation();
    const coggleNo = location.state?.coggleNo;
    const userId = useSelector( (state) => {return state.UserId} );

    const [coggle, setCoggle] = useState(
        {   
            coggleNo : coggleNo,
            title: null,
            writer: {},
            nickname: '',
            category: '',
            content: '',
        });

    useEffect(()=> {
        axios.get(`/coggle-detail/${coggleNo}/${userId}`)
        .then((response)=> {
            setCoggle({...coggle,
                        title: response.data.title, 
                        writer: response.data.writer,
                        nickname: response.data.writer.nickname,
                        category : response.data.category,
                        // categoryText: response.data.category == 'T' ? 'TechQue' : response.data.category == 'C' ? 'Carrier' :  'DevLife',
                        title: response.data.title,
                        content: response.data.content,
                        }
                                    
            )
        })
        .catch((error) => {
            console.log(error);
        })
    },[])

    /* func - 입력란 데이터 변경 함수 */
    const initChange = (e) => {
        setCoggle({...coggle, [e.target.name] : e.target.value})
    }

    useEffect(()=>{
        /* 작성중에 로그아웃되면 튕겨낸다 */
        if(userId == '')
        document.location.href='/coggle'

    }, [userId])


    /* 저장 - onclick 이벤트 종료시점 리랜더링 Flag  */
    const [reRenderFlag, setReRenderFlag] = useState(false);

    /**
     * 컴포넌트 리렌더링 후에 axios를 호출한다.
     * 저장버튼이 클릭되고 Event가 종료되는 시점
     * 즉, 리랜더링 되는 시점에 호스트 서버와 통신한다.
     * 누적되어 있던 state 변경내역들 실제 적용된다.
     */
    useEffect(() => {
        if (reRenderFlag) {
        // axios 호출
            axios.post('/coggle-update', coggle)
            .then((response)=> {
                navigate(`/coggle-detail/${coggleNo}`);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [reRenderFlag]);

    /* func - 저장 기능 */
    const submit = (e) => {
        setCoggle({...coggle, content : toastHtml}) // 내용 초기화
        confirmAlert({
            title: '코글 수정 확인',
            message: '수정 하시겠습니까?',
            buttons: [
              {
                label: "확인",
                onClick: () => {
                    setReRenderFlag(true);
                },
              },
              {
                label: "취소",
                onClick: () => { },
              },
            ],
          });
    }

    /**
     * Toast Editor
     */
    const [toastHtml, setToastHtml] = useState('');
    const [toastMarkdown, setMarkdown] = useState('');
    const context = {
        setToastHtml: setToastHtml.bind(this),
        setMarkdown: setMarkdown.bind(this)
    }

    return(
        <div style={bodyStyle}>
                <div style = {{display:"flex"}}>
                    <div>
                        <h1 style={{margin:"30px 20px 30px 10px"}}><b>코글</b></h1>
                    </div>
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        글수정
                    </div>
                </div>
                {/* 입력 폼 영역 */}                
                <div style={{width:"900px", height:"850px", margin:"0px auto", border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                <Form style={{width:"824px", height:"850px", margin:"30px auto"}}>
                        <FormGroup row >
                            <Col sm={2}>
                            <Label style={{width:"95px"}} htmlFor='category' sm={2}>카테고리</Label>
                            <select name="category" id="category" onChange={initChange} value={coggle.category || ''}
                                style={{display:"inline", width:"110px", height:"30px", fontSize:"15px", marginTop:"3.5px", padding:"0px 20px 0px 12px"}}>
                                <option value={"T"} >TechQue</option>
                                <option value={"C"} >Carrier</option>
                                <option value={"D"} >DevLife</option>
                            </select>
                            </Col>
                            <Col sm={10}>
                            <Label style={{width:"95px"}} htmlFor='title' sm={2}>제목</Label>
                                <Input type='text' name='title' id='title' onChange={initChange} value={coggle.title || ''}/>
                            </Col>
                            
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='password2' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                {/* <Input type='textarea' name='password2' id='password' 
                                style={{width:"730px", height:"500px", overflow: "auto"}}/> */}
                                <CoggleEditContext.Provider value={context} >
                                    <ToastEditor props={{mode:'edit', content:coggle.content }}/>
                                </CoggleEditContext.Provider>
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