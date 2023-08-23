import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { useState, createContext, useEffect } from 'react';
import ToastEditor from '../../ToastEditor.js'
import DaumPostcode from 'react-daum-postcode';
import axios from "axios";

export const MammothEditContext = createContext();
export default function MammothEdit() {

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

    const [mammoth, setMammoth] = useState({
        title: '', location: '', link: '', content:''
    });

    useEffect(()=> {
    axios.get('/mammoth-detail/4')
    .then((response)=> {
        console.log(response.data);
        setMammoth({...mammoth,     
                    title: response.data.title, 
                    content: response.data.content,
                    link: response.data.link,
                    location: response.data.location
                    }
                                
        )
    })
    .catch((error) => {
        console.log(error);
    })
    },[])
    /**
     * Toast Editor
     */
    const [toastHtml, setToastHtml] = useState('');
    const [toastMarkdown, setMarkdown] = useState('');
    const context = {
        setToastHtml: setToastHtml.bind(this),
        setMarkdown: setMarkdown.bind(this)
    }

    /**
     * Daum Post Code Modal
     */
    const [modalShow, setModalShow] = useState(false);
    const modalToggle = () => {
        setModalShow(!modalShow)
    }
    const addressHandle = {
        selectAddress: (data) => {
            setMammoth({ ...mammoth, location: data.address, postcode: data.zonecode });
            setModalShow(false)
        }
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
                <div style={{width:"900px", height:"1000px", margin:"0px auto", border: '0.1px solid lightgray', borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                    <Form style={{width:"825px", margin:"30px auto"}}>
                        <FormGroup row >
                            <Col sm={12}>
                            <Label htmlFor='title' sm={2}>제목</Label>
                                <Input type='text' name='title' id='title' value={mammoth.title}/>
                            </Col>
                            <Col style={{width:'850px'}}>
                            <Label htmlFor='location' sm={2}>모임 장소</Label>
                                <Input style={{float:'left', width:"750px"}} type='text' name='location' id='location' value={mammoth.location} />
                                <Button style={{float:'right'}} outline color='secondary' onClick={modalToggle}>주소 찾기</Button>
                            </Col>
                            <Col sm={12}>
                            <Label htmlFor='link' sm={2}>오픈 채팅</Label>
                                <Input type='text' name='link' id='link' value={mammoth.link}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                <MammothEditContext.Provider value={context} >
                                    <ToastEditor props={{mode:'edit', content:mammoth.content}} />
                                </MammothEditContext.Provider>
                                <br/>
                                <div style={{float:"right"}} >
                                <Button color='secondary' outline onClick={(e)=>{e.preventDefault(); navigate(-1);}}>취소</Button>&nbsp;&nbsp;
                                <Button color='secondary' onClick={(e)=>{e.preventDefault();}}>저장</Button>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                    {/* 우편번호 검색 모달 */}
                    < Modal isOpen={modalShow} fade={true} toggle={modalToggle} style={{ witop: "100px", top: "15%" }}>
                        <ModalHeader toggle={modalToggle}>주소 검색</ModalHeader>
                        <ModalBody>
                            <DaumPostcode onComplete={addressHandle.selectAddress} autoClose={false} />
                        </ModalBody>
                        {/* <ModalFooter color="secondary" onClick={modalToggle}>
                            <Button color='secondary'>닫기</Button>
                        </ModalFooter> */}
                    </ Modal>
                </div>
        </div>
        )
}