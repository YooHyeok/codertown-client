import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, createContext } from 'react';
import ToastEditor from '../ToastEditor.js'

export const Coggle = createContext();
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
                        <h1 style={{margin:"30px 20px 30px 10px"}}><b>코글</b></h1>
                    </div>
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        글쓰기
                    </div>
                </div>
                <div style={{borderTop: '0px solid lightgray'}}>
                    <Form style={{width:"824px", height:"610px", margin:"30px auto"}}>
                        <FormGroup row >
                            <Col sm={2}>
                            <Label style={{width:"95px"}} htmlFor='password' sm={2}>카테고리</Label>
                            <select name="" id="mealSelect" onChange={(e)=>{}}
                                style={{display:"inline", width:"110px", height:"30px", fontSize:"15px", marginTop:"3.5px", padding:"0px 20px 0px 12px"}}>
                                <option value={"T"} >TechQue</option>
                                <option value={"C"} >Carrier</option>
                                <option value={"D"} >DevLife</option>
                            </select>
                            </Col>
                            <Col sm={10}>
                            <Label style={{width:"95px"}} htmlFor='email' sm={2}>제&nbsp;&nbsp;목</Label>
                                <Input type='text' name='email' id='email' />
                            </Col>
                            
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='password2' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                {/* <Input type='textarea' name='password2' id='password' 
                                style={{width:"730px", height:"500px", overflow: "auto"}}/> */}
                                <Coggle.Provider value={context} >
                                    <ToastEditor props={'coggle'}/>
                                </Coggle.Provider>
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