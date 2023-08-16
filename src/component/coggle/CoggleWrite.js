import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';

export default function CoggleWrite() {
    const divStyle = {
        width: '1200px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '900px'
        , textAlign: 'left'
        , margin: '100px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };
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
                <div style={{borderTop: '0.1px solid lightgray'}}>
                    <Form style={{width:"800px", height:"700px", margin:"0px auto", margin:"50px 150px 50px 185px"}}>
                        <FormGroup row >
                            <Label style={{width:"95px"}} htmlFor='password' sm={2}>카테고리</Label>
                            <Col sm={1}>
                            <select name="" id="mealSelect" value={{}} onChange={(e)=>{}}
                                style={{display:"inline", width:"120px", height:"30px", fontSize:"15px", padding:"0px 20px 0px 12px"}}>
                                <option value={""} >전체</option>
                                <option value={"T"} >TechQue</option>
                                <option value={"C"} >Carrier</option>
                                <option value={"D"} >DevLife</option>
                            </select>
                            </Col>
                        </FormGroup>
                        <FormGroup row >
                            <Label style={{width:"95px"}} htmlFor='email' sm={2}>제&nbsp;&nbsp;목</Label>
                            <Col sm={10} style={{width:"660px"}}>
                                <Input type='text' name='email' id='email' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='password2' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col sm={11}>
                                <Input type='textarea' name='password2' id='password' 
                                style={{width:"730px", height:"500px", overflow: "auto"}}/>
                                <br/>
                                <div style={{float:"right"}} >
                                <Button color='secondary' outline>취소</Button>&nbsp;&nbsp;
                                <Button color='secondary' onClick={(e)=>{e.preventDefault();}}>저장</Button>
                                </div>
                            </Col>
                            
                        </FormGroup>
                        
                    </Form>
                </div>
        </div>
        )
}