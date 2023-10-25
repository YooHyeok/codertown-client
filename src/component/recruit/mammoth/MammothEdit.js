import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input } from 'reactstrap';
import { useState, createContext, useEffect } from 'react';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import ToastEditor from '../../ToastEditor.js'
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // npm install react-confirm-alert --save --force
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Radio, RadioGroup, FormControlLabel, FormControl, FormLabel} from '@mui/material';

export const MammothEditContext = createContext();
export default function MammothEdit() {
    const [expanded, setExpanded] = useState(false);
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);

      };
    const bodyStyle = {
        width: '1090px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };

    const navigate = useNavigate();
    const userId = useSelector( (state) => {return state.UserId} );

    const location = useLocation();
    const mammothNo = location.state?.mammothNo;

    const [mammoth, setMammoth] = useState({
        recruitNo: mammothNo, title: '', sido: '', sigungu:'', dong:'', fullLocation: '', link: '', content:''
    });

    const [addrFirstList, setAddrFirstList] = useState([]);
    const [addrSecondList, setAddrSecondList] = useState([]);
    const [addrThirdList, setAddrThirdList] = useState([]);

    const [selectFirstDefaultValue, setSelectFirstDefaultValue] = useState(0);
    const [selectSecondDefaultValue, setSelectSecondDefaultValue] = useState(0);
    const [selectThirdDefaultValue, setSelectThirdDefaultValue] = useState(0);

    useEffect(()=> {
        /* 디테일 내역 조회 */
        axios.get(`/mammoth-detail/${mammothNo}/${userId}`)
        .then((response) => {
            setMammoth({...mammoth,     
                        title: response.data.title, 
                        content: response.data.content,
                        link: response.data.link,
                        sido: response.data.location.sido,
                        sigungu : response.data.location.sigungu,
                        dong : response.data.location.dong,
                        fullLocation: response.data.location.fullLocation
                        }
            )
            /* fullLocaion을 위한 데이터 set */
            setSelectFirstLabelValue(response.data.location.sido)
            setSelectSecondLabelValue(response.data.location.sigungu)
            setSelectThirdLabelValue(response.data.location.dong)

            initAddressListSearch(response.data.location);
            
        } )
        .catch((error) => {
            console.log(error);
        })

    },[])

    /* func - 입력란 데이터 변경 함수 */
    const InputChange = (e) => {
        setMammoth({...mammoth, [e.target.name] : e.target.value})
    }

    /* 전체 리스트 조회 및 데이터 기준 radio체킹 */
    const initAddressListSearch = (mammothInitData) => {
        /* 도/특별시 리스트 초기 데이터 조회 */
        axios.get('/address-first')
        .then((response1)=> {
            setAddrFirstList(response1.data)
            let firstAddressNo = response1.data.find((obj) => obj.addrName == mammothInitData.sido)?.addressNo;
            setSelectFirstDefaultValue(firstAddressNo)

            /* 시/군/구 초기 데이터 조회 */
            axios.get('/address-second', {params:{"addrFirstNo": firstAddressNo}})
                .then((response2)=> {
                    setAddrSecondList(response2.data)
                    let secondAddressNo = response2.data.find((obj) => obj.addrName == mammothInitData.sigungu)?.addressNo;
                    setSelectSecondDefaultValue(secondAddressNo)

                    /* 동/읍/면/리 초기 데이터 조회 */
                    axios.get('/address-third', 
                        {params:{
                            "addrFirstNo": firstAddressNo,
                            "addrSecondNo":secondAddressNo
                        }})
                        .then((response3)=> {
                            setAddrThirdList(response3.data)
                            mammothInitData.dong == "전체" ?
                            setSelectThirdDefaultValue(0)
                            :
                            setSelectThirdDefaultValue(response3.data.find((obj) => obj.addrName == mammothInitData.dong)?.addressNo)
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
                .catch((error) => {
                    console.log(error);
                })
                
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const addressSecondSearch = (params) => {
        axios.get('/address-second', {params:{"addrFirstNo": params}})
        .then((response)=> {
            // setSelectFirstDefaultValue(params)
            setAddrSecondList(response.data)
            setAddrThirdList([])
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const addressThirdSearch = (params) => {
        axios.get('/address-third', 
            {params:{
                "addrFirstNo": selectFirstDefaultValue,
                "addrSecondNo":params
            }})
            .then((response)=> {
                setAddrThirdList(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /**
     * 선택된 주소 라벨 값 (이름)
     */
    const [selectedFirstLabelValue, setSelectFirstLabelValue] = useState('');
    const [selectedSecondLabelValue, setSelectSecondLabelValue] = useState('');
    const [selectedThirdLabelValue, setSelectThirdLabelValue] = useState('');


    const [inputLocationValue, setInputLocationValue] = useState('');
    
    const handleRadioChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === "firstRadio") {
            setSelectFirstDefaultValue(value); // value를 업데이트
            const selectedFirstAddress = value == 0 ? "" : addrFirstList.find((obj) => obj.addressNo == value)?.addrName; //선택된 첫번째 주소
            if (value != 0) {
                addressSecondSearch(value)
                setSelectSecondDefaultValue(0)
                setSelectFirstLabelValue(selectedFirstAddress)
                setMammoth({...mammoth, 
                    sido : selectedFirstAddress,
                    sigungu : "전체",
                    dong : "전체",
                    fullLocation : selectedFirstAddress})
                return;
            }
            setMammoth({...mammoth, 
                    sido : "전체",
                    sigungu : "전체",
                    dong : "전체",
                    fullLocation : "전체"})
            return;
        }
        if (name === "secondRadio") {
            setSelectSecondDefaultValue(value); // value를 업데이트
            if (value != 0) { /* 전체일 경우 데이터 조회하지 않는다. */
                addressThirdSearch(value)
                setSelectThirdDefaultValue(0)
                const selectedSecondAddress = value == 0 ? "" : addrSecondList.find((obj) => obj.addressNo == value)?.addrName;
                setSelectSecondLabelValue(selectedSecondAddress)
                setMammoth({...mammoth, 
                    sido : selectedFirstLabelValue,
                    sigungu : selectedSecondAddress,
                    dong : "전체",
                    fullLocation : selectedFirstLabelValue + " " + selectedSecondAddress})
                return;
            }
            setMammoth({...mammoth, 
                sido : selectedFirstLabelValue,
                sigungu : "전체",
                dong : "전체",
                fullLocation : selectedFirstLabelValue})
            return;
        }
        if (name === "thirdRadio") {
            setSelectThirdDefaultValue(value); // value를 업데이트
            const selectedThirdAddress = value == 0 ? "" : addrThirdList.find((obj) => obj.addressNo == value)?.addrName
            setSelectThirdLabelValue(selectedThirdAddress)
            setMammoth({...mammoth, 
                sido : selectedFirstLabelValue,
                sigungu : selectedSecondLabelValue,
                dong : selectedThirdAddress,
                fullLocation : selectedFirstLabelValue + " " + selectedSecondLabelValue + " " + selectedThirdAddress})
            return;
        }
    }

    useEffect(()=>{
        /* 작성중에 로그아웃되면 튕겨낸다 */
        if(userId == '')
        document.location.href='/mammoth'

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
            axios.post('/mammoth-update', mammoth)
            .then((response)=> {
                navigate(`/mammoth-detail/${mammothNo}`)
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [reRenderFlag]);

    /* func - 저장 기능 */
    const submit = (e) => {
        setMammoth({...mammoth, content : toastHtml}) // 내용 초기화
        confirmAlert({
            title: '맘모스 수정 확인',
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
                        <h1 style={{margin:"30px 20px 30px 10px"}}><b>맘모스</b></h1>
                    </div>
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        글수정
                    </div>
                </div>
                {/* 입력 폼 영역 */}                
                <div style={{width:"1090px", height:"100%", margin:"0px auto", border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                    <Form style={{width:"1015px", margin:"30px auto"}}>
                        <FormGroup row >
                            <Col sm={12}>
                            <Label htmlFor='title' sm={2}>제목</Label>
                                <Input type='text' name='title' id='title' value={mammoth.title} onChange={InputChange}/>
                            </Col>
                            </FormGroup>

                        <FormGroup row >
                            <Col sm={12}>
                                
                            <Label htmlFor='link' sm={2}>오픈톡</Label>
                                <Input type='text' name='link' id='link' value={mammoth.link} onChange={InputChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row >
                        <Col>
                        <Label htmlFor='location' sm={2}>모임 장소</Label>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                                <Input value={mammoth.fullLocation == "전체" ? "": mammoth.fullLocation} onChange={handleChange('panel1')} style={{float:'left', width:"750px"}} type='text' name='location' id='location' placeholder={!expanded ? '우측 화살표를 누른 후 펼쳐진 영역에서 지역을 선택하세요' : mammoth.fullLocation == "전체" ? "지역을 선택하세요" : mammoth.fullLocation} disabled={true}  />
                            </AccordionSummary>
                            <AccordionDetails style={{paddingRight:'0px'}}>
                                <Typography>
                                    <FormControl style={{display:'block', width:'100%',height:'100%', borderBottom:'1px solid lightgray'}}>
                                        <FormLabel id="demo-radio-buttons-group-label1"><b>도/특별시</b></FormLabel>
                                        <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label1"
                                        name="firstRadio"
                                        value={selectFirstDefaultValue}
                                        onChange={handleRadioChange}
                                        style={{listStyleType: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}
                                        >
                                        
                                            <FormControlLabel onClick={()=>{
                                                setAddrSecondList([])
                                                setAddrThirdList([])
                                            }} value={0} control={<Radio />} label="전체" />
                                            {addrFirstList.map(obj=>{
                                                return(
                                                <FormControlLabel
                                                value={obj.addressNo} control={<Radio />} label={obj.addrName} />
                                                )        
                                            })}
                                        
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl style={{display:'block', width:'100%', height:'100%', borderBottom:'1px solid lightgray'}}>
                                        <FormLabel id="demo-radio-buttons-group-label2"><b>시/군/구</b></FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label2"
                                            name="secondRadio"
                                            value={selectSecondDefaultValue}
                                            onChange={handleRadioChange}
                                            style={{listStyleType: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}
                                        >   
                                        {addrSecondList.length > 0 ?
                                            <>
                                                <FormControlLabel onClick={()=>{
                                                    setAddrThirdList([])
                                                }} value={0} control={<Radio />} label="전체" />
                                                {addrSecondList.map(obj=>{
                                                    return(
                                                    <FormControlLabel  value={obj.addressNo} control={<Radio />} label={obj.addrName} />
                                                    )        
                                                })}
                                            </>
                                            : 
                                                <span>도/특별시 를 선택해주세요</span>
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl style={{display:'block', width:'100%', height:'100%'}}>
                                        <FormLabel id="demo-radio-buttons-group-label3"><b>동/읍/면/리</b></FormLabel>
                                        <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label3"
                                                name="thirdRadio"
                                                value={selectThirdDefaultValue}
                                                onChange={handleRadioChange}
                                                style={{listStyleType: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}
                                            >   
                                            {addrThirdList.length > 0 ?
                                                <>
                                                <FormControlLabel value={0} control={<Radio />} label="전체" />
                                                {addrThirdList.map(obj=>{
                                                    return(
                                                    <FormControlLabel value={obj.addressNo} control={<Radio />} label={obj.addrName} />
                                                    )        
                                                })}
                                                </>
                                                : 
                                                <span>시/군/구 를 선택해주세요</span>
                                            }
                                            </RadioGroup>
                                    </FormControl>
                                </Typography>
                            </AccordionDetails>
                            </Accordion>
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='content' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                <MammothEditContext.Provider value={context} >
                                    <ToastEditor props={{mode:'edit', content:mammoth.content}} />
                                </MammothEditContext.Provider>
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