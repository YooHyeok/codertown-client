import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, createContext, useEffect } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import { Table } from 'reactstrap';

export const CokkiriWriteContext = createContext();
export default function MammothDetail() {
    const divStyle = {
        width: '100%' //캘린더 width 조절을 위해 부모태그에 설정한다.
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

    const [cokkiri, setCokkiri] = useState(
        {   
            title: null,
            content: "updatevalue",
            link: "updatevalue",
            objectWeek: 4,
            subject: "abcde",
            teamName: "fghij",
            projectParts: []
        }
             )

    useEffect(()=> {
        axios.get('/cokkiri-detail/3')
        .then((response)=> {
            console.log(response.data);
            setCokkiri({...cokkiri,     
                        title: response.data.cokkiriDto.title, 
                        content: response.data.cokkiriDto.content,
                        link: response.data.cokkiriDto.link,
                        objectWeek: response.data.projectDto.objectWeek,
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
                {/* <div style = {{width:'1200px', margin: '0px auto', display:"flex", borderBottom: '0.1px solid lightgray'}}>
                    <div>
                        <h1 style={{margin:"30px 20px 30px 10px"}}><b>코끼리</b></h1>
                    </div>
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        상세보기
                    </div>
                </div> */}
                {/* 글 제목 */}
                <div style = {{width:'1200px', margin: '50px auto', display:"flex", borderBottom: '0.1px solid lightgray'}}>
                    <div style={{margin:"30px 20px 10px 10px"}}>
                        <h3 ><b>광명 모각코 구합니다!!!!!!!!!! </b></h3>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{'유혁스쿨'}</span> <br/> <span>{'2023-08-21'}</span> <span>조회수 {'33'}</span>
                        </div>
                    </div>

                </div>
                {/* 글 내용 */}
                <div style={{display:'flex',width:'1200px', height:'100%', margin :'0px auto'}}>
                    {/* 토스트 뷰어 영역 */}
                    <div style={{ width: '725px', minHeight:'700px', fontSize: '16px', border: '0px soild lightgray'}}>
                        <Viewer initialValue={cokkiri.content}/>
                    </div>
                    {/* 프로젝트 상세정보 영역 */}
                    <div style={{ width:"475px", height:"100%", float:'right', border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                        <Form style={{width:"450px", height:'150px', margin:"30px"}}>
                            <FormGroup row>
                                {/* <Col sm={12}>
                                <Label htmlFor='title' sm={2}>제목</Label>
                                    <Input type='text' name='title' id='title' />
                                </Col> */}
                                <Col sm={10} >
                                <Label htmlFor='password' sm={6}>지역</Label>
                                    <Input type='text' name='location' id='location' />
                                </Col>
                                {/* <Col sm={5}>
                                <Label htmlFor='email' sm={6}>성별 제한</Label>
                                    <Input type='text' name='teamName' id='teamName' />
                                </Col>
                                <Col sm={5}>
                                <Label htmlFor='email' sm={5}>인원수</Label>
                                    <Input type='text' name='objectWeek' id='objectWeek' placeholder={'주 단위 입력'}/>
                                </Col> */}
                                <Col sm={10}>
                                <Label htmlFor='email' sm={6}>링크</Label>
                                    <Input type='text' name='link' id='link' placeholder='카카오톡 / 디스코드 / 구글폼 등 (생략 가능)'/>
                                </Col>                            
                            </FormGroup>
                            {/* <FormGroup row>
                                <Label htmlFor='email' sm={6} style={{marginLeft:'55px'}}>모집 현황</Label>
                                <Table bordered="columns" style={{width:"300px", marginLeft:'65px'}}>
                                    <thead>
                                        <tr>
                                        <th>파트 / 현황</th>
                                        <th>모집 인원</th>
                                        <th>남은 자리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>PM</td>
                                            <td>1</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td>디자이너</td>
                                            <td>1</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td>퍼블리셔</td>
                                            <td>1</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td>프론트엔드</td>
                                            <td>2</td>
                                            <td>1</td>
                                        </tr>
                                        <tr>
                                            <td>백엔드</td>
                                            <td>4</td>
                                            <td>2</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </FormGroup> */}
                        </Form>
                        <div className='study-dm-btn-gruop' style={{textAlign:'center', margin: '100px auto'}}>
                            <Button color='primary'>스터디 참여 요청 DM 보내기</Button>
                        </div>
                    </div>

                </div>
                <div className='button-group' style={{width:'1200px', margin: '50px auto'}}>
                    <div className='update-delete-btn-gruop' style={{marginTop:"50px", textAlign:'right'}}>
                        <Button color='secondary'>수정</Button>
                        <Button color='danger'>삭제</Button>
                    </div>
                    
                </div>
                {/* 댓글영역 */}
                <div style = {{width:'1200px', margin: '50px auto', display:"flex", borderTop: '0.1px solid lightgray'}}>
                    <div style={{margin:"30px 20px 10px 10px"}}>
                        <h3 ><b>이곳은 댓글영역입니다</b></h3>
                        <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                        <div>
                            <span>{'유혁스쿨'}</span> <br/> <span>{'2023-08-21'}</span>
                        </div>
                    </div>

                </div>

        </div>
        )
}