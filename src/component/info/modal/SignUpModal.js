import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Row, Col } from 'reactstrap';
import {useContext, useEffect} from 'react';
import { HeaderSignUpContext } from '../dropdown/HeaderDropDownLogin';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import useToast from '../../../hook/useToast';


export default function SignUpModal() {
    const context = useContext(HeaderSignUpContext);
    const { toastAlertSuccess } = useToast();

    const modalStyle = { 
        width: "325px",
        // height: "500px",
        top: "20%"
        // , left: "30%"
        // , position: "fixed"
        // , transform: "translate(15%,-50%)"
    }
    const [cookie, setCookie] = useCookies(['refreshToken']);
    const dispatch = useDispatch();
    useEffect(() => {
        // 부모 창에서 메시지를 수신하고 모달을 열어주는 함수
        const handleSocialModal = (event) => {
            console.log(event.data)
            /* 회원 가입 모달 */
            if (event.data.message === 'OAuth2.0 signup') {
                context.signUpToggle();
                context.signUpSocialToggle();
            } 
            /* 로그인 처리  */
            else if (event.data.message === 'OAuth2.0 signin') {
                context.signUpToggle();

                /* 리덕스, 쿠키 email, accessToken, refreshToken 저장 */
                const loginEmail = event.data.email;
                const accessToken = event.data.accessToken;
                const refreshToken = event.data.refreshToken;
                console.log(loginEmail)
                dispatch({type:"NEWTOKEN", data: accessToken})
                dispatch({type:"USERID", data: loginEmail})
                const expires = new Date();
                expires.setDate(expires.getDate() + 1); //현재날짜 + 1 = 하루
                setCookie('refreshToken', refreshToken, {url:'/',expires})
                toastAlertSuccess("로그인에 성공했습니다")
            }
        };
        window.addEventListener('message', handleSocialModal);
        return () => {
          window.removeEventListener('message', handleSocialModal);
        };
      }, []);
    return(
            <Modal isOpen={context.signUpShow} toggle={context.signUpToggle} style={modalStyle}>
            <ModalHeader toggle={context.signUpToggle} >
                    <span style={{textAlign:"center !important"}}>회원가입</span>
                </ModalHeader>
                <ModalBody>
                <Form >
                    <FormGroup >
                        <Row>
                            <Col>
                                <Button color="secondary" onClick={(e)=>{e.preventDefault();}} style={{width:"285px"}}>구글로 시작하기</Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup >
                        <Row>
                            <Col>
                                <Button color="warning" 
                                onClick={
                                    (e)=>{e.preventDefault();
                                        let width = 500;
                                        let height= 700;
                                        let left = Math.ceil((window.screen.width - width*2));
                                window.open(
                                    'http://localhost/oauth2/authorization/kakao', 
                                    'blank', 
                                    `toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=${width},height=${height},left=${left}`)
                                    }} style={{width:"285px"}}>카카오로 시작하기</Button>
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
                </ModalBody>
                <ModalFooter >
                    <Button outline color="secondary" style={{width:"285px"}}
                        onClick={(e)=>{
                            e.preventDefault();
                            context.signUpToggle(); //현재 토글 닫기.
                            context.signUpSimpleToggle(); // 간편 회원가입 토글 열기.
                    }}>ID / PW 회원가입</Button>
                </ModalFooter>
            </Modal>
    )
}