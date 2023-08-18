import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, createContext } from 'react';
import ToastEditor from '../ToastEditor.js'

export const Cokkiri = createContext();
export default function CoggleWrite() {
    const divStyle = {
        width: '1200px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '150px'
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

    return(
        <div style={divStyle}>
                <div style = {{display:"flex"}}>
                    <div>
                        <h1 style={{margin:"30px 20px 30px 10px"}}><b>코끼리</b></h1>
                    </div>
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        글쓰기
                    </div>
                </div>
                <div style={{borderTop: '0px solid lightgray'}}>
                    <Form style={{width:"824px", height:"760px", margin:"30px auto"}}>
                        <FormGroup row>
                            <Col sm={12}>
                            <Label htmlFor='title' sm={2}>제목</Label>
                                <Input type='text' name='title' id='title' />
                            </Col>
                            <Col sm={3}>
                            <Label htmlFor='password' sm={6}>프로젝트 주제</Label>
                                <Input type='text' name='email' id='email' />
                            </Col>
                            <Col sm={3}>
                            <Label htmlFor='email' sm={6}>팀 이름</Label>
                                <Input type='text' name='email' id='email' />
                            </Col>
                            <Col sm={3} >
                                <Label htmlFor='password' sm={6}>파트 추가</Label>
                                <select name="" id="mealSelect" onChange={(e)=>{}}
                                    style={{display:"inline", width:'188px', height:"38px", padding:"0px 20px 0px 12px",border:'var(--bs-border-width) solid var(--bs-border-color)', borderRadius:'var(--bs-border-radius)'} }>
                                    <option value={"D"} >PM</option>
                                    <option value={"D"} >백엔드</option>
                                    <option value={"T"} >프론트엔드</option>
                                    <option value={"C"} >디자인/퍼블리싱</option>
                                </select>
                            </Col>
                            {/* <Col sm={4}/> */}
                            <Col sm={3}>
                                <Label htmlFor='location' sm={12}>파트별 모집 인원</Label>
                                <div style={{display:'flex', width:'180px'}}>
                                    <Input style={{float:'left'}} type='number' name='location' id='location' min={1} />
                                    &nbsp;<Button style={{float:'right', width:'80px', height:'38px'}} outline color='secondary' onClick={(e)=>{e.preventDefault();}} >추가</Button>
                                </div>
                            </Col>
                            <Col style={{width:'140px'}}>
                                <Label htmlFor='location' sm={12}>파트 추가/제거</Label>
                                <div style={{display:'flex', width:'825px', height:'38px', border:'var(--bs-border-width) solid var(--bs-border-color)', borderRadius:'var(--bs-border-radius)' }}>
                                    map으로 처리한다.
                                </div>
                            </Col>
                            
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='password2' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                {/* <Input type='textarea' name='password2' id='password' 
                                style={{width:"730px", height:"500px", overflow: "auto"}}/> */}
                                <Cokkiri.Provider value={context} >
                                    <ToastEditor props={'cokkiri'}/>
                                </Cokkiri.Provider>
                                <br/>
                                <div style={{float:"right"}} >
                                <Button color='secondary' outline onClick={(e)=>{e.preventDefault(); navigate(-1);}}>취소</Button>&nbsp;&nbsp;
                                <Button color='secondary' onClick={(e)=>{e.preventDefault();}}>저장</Button>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
        </div>
        )
}