import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { useState, createContext } from 'react';
import ToastEditor from '../ToastEditor.js'
import DaumPostcode from 'react-daum-postcode';

export const Mammoth = createContext();
export default function MammothWrite() {

    const bodyStyle = {
        width: '1200px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '100%'
        , textAlign: 'left'
        , margin: '50px auto'
        , marginBottom: '150px'
        , padding: '30px'
        , top: '100'
      };
      const navigate = useNavigate();

    const [mammoth, setMammoth] = useState({
        nickname: '', id: '', password: '', postcode: '', location: '', addrDetail: '', email: ''
    });

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
                        글쓰기
                    </div>
                </div>
                <div style={{borderTop: '0px solid lightgray'}}>
                    <Form style={{width:"824px", height:"760px", margin:"30px auto"}}>
                        <FormGroup row >
                            <Col sm={12}>
                            <Label htmlFor='title' sm={2}>제목</Label>
                                <Input type='text' name='title' id='title' />
                            </Col>
                            <Col style={{width:'850px'}}>
                            <Label htmlFor='location' sm={2}>모임 장소</Label>
                                <Input style={{float:'left', width:"750px"}} type='text' name='location' id='location' value={mammoth.address} />
                                <Button style={{float:'right'}} outline color='secondary' onClick={modalToggle}>주소 찾기</Button>
                            </Col>
                            <Col sm={12}>
                            <Label htmlFor='link' sm={2}>오픈 채팅</Label>
                                <Input type='text' name='link' id='link' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='' sm={11}>내용 (에디터 교체 예정) </Label>
                            <Col>
                                <Mammoth.Provider value={context} >
                                    <ToastEditor props={'mammoth'} />
                                </Mammoth.Provider>
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