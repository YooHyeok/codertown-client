import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, createContext, useEffect } from 'react';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

import ToastEditor from '../../ToastEditor.js'
import axios from "axios";

export const CokkiriWriteContext = createContext();
export default function CokkiriWrite() {
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
    const userId = useSelector((state) => { return state.UserId });

    const [toastHtml, setToastHtml] = useState('');
    const [toastMarkdown, setMarkdown] = useState('');
    const context = {
        setToastHtml: setToastHtml.bind(this),
        setMarkdown: setMarkdown.bind(this)
    }

    const [partNo, setPartNo] = useState('1');
    const [partName, setPartName] = useState('PM');
    const [recruitCount, setRecruitCount] = useState('');


    const [projectParts, setProjectParts] = useState([]);

    const [isShaking, setIsShaking] = useState(false);
    const inputStyle = isShaking ? { border: '2px solid red' } : {};


    /* state - 코끼리 저장 객체 */
    const [cokkiri, setCokkiri] = useState({
        writer: userId, //로그인 한 사용자 계정
        cokkiriTitle: '',
        projectSubject: '',
        projectTitle: '',
        teamname: '',
        objectWeek: '',
        link: '',
        content: '',
        projectParts: []
    })

    /* func - 입력란 데이터 변경 함수 */
    const InputChange = (e) => {
        setCokkiri({...cokkiri, [e.target.name] : e.target.value})
    }

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
            axios.post('/cokkiri-save', cokkiri)
            .then((response)=> {
                document.location.href='/cokkiri'
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [reRenderFlag]);

    /* func - 저장 기능 */
    const submit = () => {
        setCokkiri({...cokkiri, projectParts : projectParts, content : toastHtml});
        alert("저장 하시겠습니까?");
        setReRenderFlag(true);
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
                {/* 입력 폼 영역 */}
                <div style={{width:"900px", height:"1105px", margin:"0px auto", border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                    <Form style={{width:"825px", margin:"30px auto"}}>
                        <FormGroup row>
                            <Col sm={12}>
                            <Label htmlFor='cokkiriTitle' sm={2}>제목</Label>
                                <Input type='text' name='cokkiriTitle' id='cokkiriTitle' onChange={InputChange}/>
                            </Col>
                            <Col sm={6}>
                            <Label htmlFor='projectSubject' sm={6}>프로젝트 상세 주제</Label>
                                <Input type='text' name='projectSubject' id='projectSubject' placeholder='ex)~커뮤니티 플랫폼 / ~쇼핑몰 서비스'  onChange={InputChange}/>
                            </Col>
                            <Col sm={4}>
                            <Label htmlFor='teamname' sm={6}>팀 이름</Label>
                                <Input type='text' name='teamname' id='teamname'  onChange={InputChange}/>
                            </Col>
                            <Col sm={2}>
                            <Label htmlFor='objectWeek' sm={5}>목표 기간</Label>
                                <Input type='number' name='objectWeek' id='objectWeek' placeholder={'주 단위 입력'} onChange={InputChange}/>
                            </Col>
                            <Col sm={6}>
                            <Label htmlFor='link' sm={6}>링크</Label>
                                <Input type='text' name='link' id='link' placeholder='카카오톡 / 디스코드 / 구글폼 등 (생략 가능)' onChange={InputChange}/>
                            </Col>
                            <Col sm={3} >
                                <Label htmlFor='part' sm={6}>파트 추가</Label>
                                <select name="part" id="part" onChange={(e)=>{
                                    setPartNo(e.target.value);
                                    setPartName(e.target.options[e.target.selectedIndex].textContent) //옵션 text노드 추출후 저장
                                }}
                                    style={{display:"inline", width:'188px', height:"38px", padding:"0px 20px 0px 12px",border:'var(--bs-border-width) solid var(--bs-border-color)', borderRadius:'var(--bs-border-radius)'} }>
                                    <option value={"1"} >PM</option>
                                    <option value={"2"} >디자이너</option>
                                    <option value={"3"} >퍼블리셔</option>
                                    <option value={"4"} >프론트엔드</option>
                                    <option value={"5"} >백엔드</option>
                                </select>
                            </Col>
                            {/* <Col sm={4}/> */}
                            <Col sm={3}>
                                <Label htmlFor='recruitCount' sm={12}>파트별 모집 인원</Label>
                                <div style={{display:'flex', width:'180px'}}>
                                    <Input style={ isShaking ? { border: '2px solid red' } : {float:'left'}} type='number' name='recruitCount' id='recruitCount' value={recruitCount} min={'1'} max={'9'}
                                    onChange={(e)=>{
                                        /* if (e.target.value != null && (e.target.value < 1 || e.target.value > 9)) {
                                            setRecruitCount('');
                                            setIsShaking(true);
                                            setTimeout(() => {
                                                setIsShaking(false);
                                            }, 300); // 흔들기 효과를 일시적으로 보여주기 위한 시간
                                            return;
                                        } */
                                        setRecruitCount(e.target.value)
                                        setIsShaking(false);
                                    }}
                                    />
                                    &nbsp;<Button style={{float:'right', width:'80px', height:'38px'}} outline color='secondary' onClick={(e)=>{
                                        // e.preventDefault();
                                        if( recruitCount == '') {
                                            alert('모집 인원이 입력되지 않았습니다. 모집 인원을 입력해 주세요.');
                                            return false;
                                        }
                                        /* 5개 이상 등록 불가 */
                                        if(projectParts.length > 4) {alert('최대 개수 5개를 초과하였습니다.'); return;}
                                        /* 중복 불가 - Array.prototype.some() */
                                        if(projectParts.some(part => part.partNo === partNo)) {alert('이미 추가된 파트입니다. 중복으로 추가할 수 없습니다.'); return;}
                                            setProjectParts([...projectParts, {partNo:partNo, partName:partName, recruitCount:recruitCount}]);
                                        }} >추가</Button>
                                </div>
                            </Col>
                            
                        </FormGroup>
                        <FormGroup row>
                            <Col>
                                <Label htmlFor='location' sm={12}>추가 파트 미리보기 (최대 5개 중복 불가)</Label>
                                {/* 추가될 영역 */}
                                <div style={{display:'flex', width:'100%', height:'50px', margin:'0 auto', backgroundColor:'#f7f9fc', border:'var(--bs-border-width) solid var(--bs-border-color)', borderRadius:'var(--bs-border-radius)' }}>
                                    {/* 반복될 추가 요소 */}
                                    {projectParts.map((projectPart)=>{
                                        return(
                                        <div style={{display:'flex', width:'120px', height:'39px', backgroundColor:'white', margin:"5px", border:'var(--bs-border-width) solid var(--bs-border-color)', borderRadius:'var(--bs-border-radius)', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)" }}>
                                            <div style={{width:'73px', margin:'5px', textAlign:'center'}}>
                                                <span>{projectPart.partName} {projectPart.recruitCount}명</span>
                                                </div>
                                            <div>
                                            <Button size='sm'style={{width:'30px', margin:'3px'}}
                                                onClick={(e) =>{
                                                    // e.preventDefault();
                                                    /*  */
                                                    const updatedParts = projectParts.filter(part => part.partNo !== projectPart.partNo);
                                                    setProjectParts(updatedParts);
                                                }}> - </Button></div>
                                        </div>)
                                        })
                                    }
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='password2' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                {/* <Input type='textarea' name='password2' id='password' 
                                style={{width:"730px", height:"500px", overflow: "auto"}}/> */}
                                <CokkiriWriteContext.Provider value={context} >
                                    <ToastEditor props={{mode:'write'}}/>
                                </CokkiriWriteContext.Provider>
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