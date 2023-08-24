import { useNavigate, useLocation  } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input} from 'reactstrap';
import { useState, createContext, useEffect } from 'react';
import ToastEditor from '../../ToastEditor.js'
import axios from "axios";

export const CokkiriEditContext = createContext();
export default function CokkiriEdit() {
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

    const location = useLocation();
    const cokkiriNo = location.state?.cokkiriNo;
    // const { no } = location.state == null ? '' : location.state;

    /* state - 토스트 에디터 change를 위한 변수 */
    const [toastHtml, setToastHtml] = useState('');
    const [toastMarkdown, setMarkdown] = useState('');

    /* context - 토스트 에디터 chnge를 위한 context객체 */
    const context = {
        setToastHtml: setToastHtml.bind(this),
        setMarkdown: setMarkdown.bind(this),
    }

    /* state - 코끼리 출력/저장 객체 */
    const [cokkiri, setCokkiri] = useState({
        recruitNo: cokkiriNo, //저장용
        cokkiriTitle: '',
        projectSubject: '',
        projectTitle: '',
        teamname: '',
        objectWeek: '',
        link: '',
        content: '',
        projectParts: []
    })

    /* state - 파트 추가/제거용 변수 */
    const [partNo, setPartNo] = useState('1');
    const [partName, setPartName] = useState('PM');
    const [recruitCount, setRecruitCount] = useState('');

    /* state - 삭제를 위한 원본 파트 배열 */
    const [originalProjectParts, setOriginalProjectParts] = useState([]);

    /* state - 저장용 배열 객체 - projectPartUpdate */
    const [projectPartUpdate, setProjectPartUpdate] = useState({
        update: [],
        delete: [],
        insert: []
    });

    /* state - 저장용 통합 객체 */
    const [saveUpdateObject, setSaveUpdateObject] = useState({
        cokkiriUpdate: cokkiri,
        projectPartUpdate: projectPartUpdate,
    });

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
            axios.post('/cokkiri-update', {cokkiriUpdate: cokkiri, projectPartUpdate:projectPartUpdate})
            .then((response)=> {
                document.location.href='/cokkiri-detail/'+cokkiriNo
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [reRenderFlag]);

    /* func - 저장 기능 */
    const submit = (e) => {
        console.log(toastHtml)
        console.log(toastMarkdown)
        setCokkiri({...cokkiri, content : toastHtml}) // 내용 초기화
        alert("저장 하시겠습니까?");
        // setReRenderFlag(true);
    }

    /* 페이지 첫 진입시 데이터 출력용 랜더링 */
    useEffect(()=> {
        axios.get('/cokkiri-detail/'+cokkiriNo)
        .then((response)=> {
            setCokkiri({...cokkiri,     
                cokkiriTitle: response.data.cokkiriDto.title, 
                content: response.data.cokkiriDto.content,
                link: response.data.cokkiriDto.link,
                objectWeek: response.data.projectDto.objectWeek,
                projectSubject: response.data.projectDto.subject,
                teamname: response.data.projectDto.teamName,
                projectParts: response.data.projectDto.projectParts
                        }
                                    
            )
            setOriginalProjectParts(response.data.projectDto.projectParts)
        })
        .catch((error) => {
            console.log(error);
        })
    },[])


    return(
        <div style={divStyle}>
                <div style = {{display:"flex"}}>
                    <div>
                        <h1 style={{margin:"30px 20px 30px 10px"}}><b>코끼리</b></h1>
                    </div>
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        글수정
                    </div>
                </div>
                {/* 입력 폼 영역 */}
                <div style={{width:"900px", height:"1095px", margin:"0px auto", border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                    <Form style={{width:"825px", margin:"30px auto"}}>
                        <FormGroup row>
                            <Col sm={12}>
                            <Label htmlFor='title' sm={2}>제목</Label>
                                <Input type='text' name='cokkiriTitle' id='title' value={cokkiri.cokkiriTitle} 
                                onChange={InputChange}/>
                            </Col>
                            <Col sm={6}>
                            <Label htmlFor='password' sm={6}>프로젝트 상세 주제</Label>
                                <Input type='text' name='projectSubject' id='subject' value={cokkiri.projectSubject} placeholder='ex)~커뮤니티 플랫폼 / ~쇼핑몰 서비스' 
                                onChange={InputChange}/>
                            </Col>
                            <Col sm={4}>
                            <Label htmlFor='email' sm={6}>팀 이름</Label>
                                <Input type='text' name='teamname' id='teamName' value={cokkiri.teamname} 
                                onChange={InputChange}/>
                            </Col>
                            <Col sm={2}>
                            <Label htmlFor='email' sm={5}>목표 기간</Label>
                                <Input type='number' name='objectWeek' id='objectWeek' value={cokkiri.objectWeek} placeholder={'주 단위 입력'}
                                onChange={InputChange}/>
                            </Col>
                            <Col sm={6}>
                            <Label htmlFor='email' sm={6}>링크</Label>
                                <Input type='text' name='link' id='link' value={cokkiri.link} placeholder='카카오톡 / 디스코드 / 구글폼 등 (생략 가능)'
                                onChange={InputChange}/>
                            </Col>
                            <Col sm={3} >
                                <Label htmlFor='part' sm={6}>파트 추가</Label>
                                <select name="part" id="part" onChange={(e)=>{
                                    setPartNo(e.target.value);
                                    setPartName(e.target.options[e.target.selectedIndex].textContent)
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
                                    <Input style={{float:'left'}} type='text' name='recruitCount' id='recruitCount' min={1}
                                    onChange={(e)=>{
                                        setRecruitCount(e.target.value)
                                    }}/>
                                    &nbsp;<Button style={{float:'right', width:'80px', height:'38px'}} outline color='secondary' onClick={(e)=>{
                                        // e.preventDefault();
                                        if( recruitCount == '') {
                                            alert('모집 인원이 입력되지 않았습니다. 모집 인원을 입력해 주세요.');
                                            return false;
                                        }
                                        /* 5개 이상 등록 불가 */
                                        if(cokkiri.projectParts.length > 4) {alert('최대 개수 5개를 초과하였습니다.'); return;}
                                        /* 중복 불가 - Array.prototype.some() */
                                        if(cokkiri.projectParts.some(part => part.partNo == partNo)) {alert('이미 추가된 파트입니다. 중복으로 추가할 수 없습니다.'); return;}
                                            /* 화면단 데이터 처리 - 배열을 복사하여 처리한다. - prevCokkiri : 원본 배열  */
                                            let projectPartAdd = {partNo: partNo, partName: partName, recruitCount: recruitCount};
                                            setCokkiri((prevCokkiri) => (
                                                {...prevCokkiri,
                                                 projectParts: [...prevCokkiri.projectParts, /* 원본배열에 배열요소를 추가하고 원본배열에 다시 덮어씌운다. */
                                                 projectPartAdd]
                                                })
                                              );
                                            /* 저장시 사용될 insert배열에 추가 */
                                            setProjectPartUpdate((prevUpdate) => (
                                                    {...prevUpdate, insert: [...prevUpdate.insert, projectPartAdd]}
                                            )); 

                                        }} >추가</Button>
                                </div>
                            </Col>
                            
                        </FormGroup>
                        <FormGroup row>
                            <Col style={{width:'140px'}}>
                            <Label htmlFor='location' sm={12}>추가 파트 미리보기 (최대 5개 중복 불가)</Label>
                                {/* 추가될 영역 */}
                                <div style={{display:'flex', width:'100%', height:'50px', margin:'0 auto', backgroundColor:'#f7f9fc', border:'var(--bs-border-width) solid var(--bs-border-color)', borderRadius:'var(--bs-border-radius)' }}>
                                    {/* 반복될 추가 요소 */}
                                    {cokkiri.projectParts.map((projectPart)=>{
                                        return(
                                        <div key={cokkiri.projectParts.projectPartNo} style={{display:'flex', width:'120px', height:'39px', backgroundColor:'white', margin:"5px", border:'var(--bs-border-width) solid var(--bs-border-color)', borderRadius:'var(--bs-border-radius)' }}>
                                            <div style={{width:'73px', margin:'5px', textAlign:'center'}}>
                                                <span>{projectPart.partName} {projectPart.recruitCount}명</span>
                                                </div>
                                            <div>
                                            <Button size='sm'style={{width:'30px', margin:'3px'}}
                                                onClick={(e) =>{
                                                    /**
                                                     * 출력용 데이터 제어
                                                     * 파트 번호가 일치하지 않는 파트요소를 걸러낸 배열을 새롭게 저장한다.
                                                     */
                                                    const updatedParts = cokkiri.projectParts.filter(part => {
                                                        return part.partNo !== projectPart.partNo;
                                                    });
                                                    setCokkiri({...cokkiri, projectParts:updatedParts})
                                                    /**
                                                     * 저장용 배열 제어
                                                     * projetPartUpdate 배열에 삭제된 데이터 추가
                                                     * 1. 삭제한 데이터가 원본 데이터에 존재하는 경우 기존 데이터에 데이터를 추가하고 덮어 씌운다.
                                                     * 2. 삭제한 데이터가 원본 데이터에 존재하지 않는(새로 추가된 데이터의)경우 기존 데이터를 덮어 씌운다.
                                                     */
                                                    setProjectPartUpdate((prevUpdate) => {
                                                        const foundPart = originalProjectParts.find(part => part.partNo === projectPart.partNo);
                                                        if (foundPart !== undefined) {
                                                            return { /* undefined가 아닐경우 기존 데이터에 추가된 데이터로 덮어씌운다. */
                                                            ...prevUpdate,
                                                            delete: [...prevUpdate.delete, foundPart]
                                                            };
                                                        } 
                                                        return prevUpdate; /* undefind일 경우 기존 데이터를 덮어씌운다. */
                                                        
                                                    });
                                                    /**
                                                     * 원본 파트 배열 제어
                                                     * originalProjectParts 배열에 삭제된 데이터를 제외한 데이터로 덮어씌운다. 
                                                     */
                                                    setOriginalProjectParts(originalProjectParts.filter(part => part.partNo !== projectPart.partNo));
                                                }}> - </Button></div>
                                        </div>)
                                    })}
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='content' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                <CokkiriEditContext.Provider value={context} >
                                    <ToastEditor props={{mode:'edit', content:cokkiri.content}}/>
                                </CokkiriEditContext.Provider>
                                <br/>
                                <div style={{float:"right"}} >
                                <Button color='secondary' outline onClick={(e)=>{e.preventDefault(); navigate(-1);}}>취소</Button>&nbsp;&nbsp;
                                <Button color='secondary' onClick={(e)=>{submit(e);}}>저장</Button>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
        </div>
        )
}