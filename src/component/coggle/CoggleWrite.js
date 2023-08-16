import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';

export default function CoggleWrite() {
    const divStyle = {
        width: '1200px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '700px'
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
                <Form style={{margin:"20px auto", paddingLeft:"20px"}}>
                        <FormGroup row >
                            <Label style={{width:"95px"}} htmlFor='email' sm={2}>제&nbsp;&nbsp;목</Label>
                            <Col sm={8} style={{display:"flex"}}>
                                <Input type='text' name='email' id='email' />
                            </Col>
                        </FormGroup>
                        <FormGroup row >
                            <Label style={{width:"95px"}} htmlFor='password' sm={2}>패스워드</Label>
                            <Col sm={8}>
                                <Input type='text' name='password' id='password' />
                            </Col>
                        </FormGroup>
                        <FormGroup row >
                            <Label style={{width:"95px"}} htmlFor='password2' sm={2}>패스워드 확인</Label>
                            <Col sm={8}>
                                <Input type='textarea' name='password2' id='password' />
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
        </div>
        )
}