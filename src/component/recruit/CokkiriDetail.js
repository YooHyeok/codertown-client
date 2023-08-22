import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Viewer } from '@toast-ui/react-editor';
import { Table } from 'reactstrap';
import _ from 'lodash'; // Lodash 라이브러리

export default function CokkiriDetail() {
    const divStyle = {
        width: '100%' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
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
                        <h1 style={{margin:"30px auto"}}><b>코끼리</b></h1>
                        <h6 style={{width:'130px',margin:"50px auto"}}>코딩하는 사람 끼리</h6>
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
                <div style={{display:'flex',width:'1200px', height:'100%', margin :'0px auto'}}>
                    {/* 토스트 뷰어 영역 */}
                    <div style={{ width: '725px', minHeight:'600px', border: '0px soild lightgray'}}>
                        <Viewer className="toast-viewer" initialValue={cokkiri.content} key={cokkiri.content}/>
                    </div>
                    {/* 프로젝트 상세정보 영역 */}
                    <div style={{width:"475px", height:"100%", float:'right'}}>
                        <div style={{width:"475px", minHeight:'500px', border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                            <Form style={{width:"450px", margin:"30px"}}>
                                <FormGroup row>
                                    <Col sm={11} >
                                    <Label htmlFor='password' sm={6}>프로젝트 상세 주제</Label>
                                        <Input type='text' name='subject' id='subject' value={cokkiri.subject} readOnly/>
                                    </Col>
                                    <Col sm={7}>
                                    <Label htmlFor='email' sm={6}>팀 이름</Label>
                                        <Input type='text' name='teamName' id='teamName' value={cokkiri.teamName} readOnly/>
                                    </Col>
                                    <Col sm={4}>
                                    <Label htmlFor='email' sm={5}>목표 기간</Label>
                                        <Input type='number' name='objectWeek' id='objectWeek' value={cokkiri.objectWeek} readOnly/>
                                    </Col>
                                    <Col sm={11}>
                                    <Label htmlFor='email' sm={6}>링크</Label>
                                        <Input type='text' name='link' id='link' value={cokkiri.link} readOnly/>
                                    </Col>                            
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor='email' sm={6} style={{marginLeft:'55px'}}>파트별 현황</Label>
                                    <Table bordered={true} style={{width:"300px", marginLeft:'65px'}}>
                                        <thead>
                                            <tr>
                                            <th>파트 / 현황</th>
                                            <th>모집 인원</th>
                                            <th>남은 자리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cokkiri.projectParts.map((obj) => {
                                                
                                                return(
                                                    <tr key={obj.partNo}>
                                                        <td>{obj.partName}</td>
                                                        <td>{obj.recruitCount}</td>
                                                        <td>{obj.currentCount}</td>
                                                    </tr>
                                                )
                                            })}
                                        
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Form>
                        </div>
                        <div className='project-dm-btn-gruop' style={{textAlign:'center', margin: '100px auto'}}>
                            <select name="" id="mealSelect" onChange={(e)=> {
                                if (cokkiri.projectParts.find(obj => obj.partNo == e.target.value).currentCount == 0) {
                                    alert('선택하신 파트는 현재 남은자리가 없습니다.'); 
                                    return;
                                }
                            }}
                                style={{display:"inline", width:"110px", height:"30px", fontSize:"15px", marginTop:"3.5px", padding:"0px 20px 0px 12px"}}>
                                <option value={"1"} >PM</option>
                                <option value={"2"} >디자인</option>
                                <option value={"3"} >퍼블리셔</option>
                                <option value={"4"} >프론트엔드</option>
                                <option value={"5"} >백엔드</option>
                            </select>
                            &nbsp;&nbsp;
                            <Button color='primary'>프로젝트 참여 요청</Button>
                            {/* <Button color='primary'>프로젝트 참여 요청 DM 보내기</Button> */}
                        </div>
                    </div>
                </div>
            {/* 댓글영역 */}
            {/* <div style = {{width:'1200px', margin: '50px auto', display:"flex", borderTop: '0.1px solid lightgray'}}>
                <div style={{margin:"30px 20px 10px 10px"}}>
                    <h3 ><b>이곳은 댓글영역입니다</b></h3>
                    <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%', float:"left"}}/> 
                    <div>
                        <span>{'유혁스쿨'}</span> <br/> <span>{'2023-08-21'}</span>
                    </div>
                </div>
            </div> */}
        </div>
        )
}