import { Messenger, X } from 'react-bootstrap-icons';
import "react-chat-elements/dist/main.css"
import { useRef, useState, useEffect } from 'react';
import Chat from './Chat.js';
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";
import { CSSTransition } from "react-transition-group";

export default function MessengerFrame() {

  const chatOpenBtnRef = useRef('');
  const chatCloseBtnRef = useRef('');
  const chatComponentRef = useRef('');  
  const [chatFrameOnOff, setChatFrameOnOff] = useState(false);
  const [connected, setConnected] = useState(false);
  // const [connected, setConnected] = useState(sessionStorage.getItem('stompConnected'));
  const [newMsgTotalCount, setNewMsgTotalCount] = useState(0);

  const userId = useSelector( (state) => {return state.UserId} );

  const [client, setClient] = useState(null);
  

  useEffect(() => {
    if (userId != '') {

      const formData = new FormData();
      formData.append('loginEmail', userId)
      /* setInterval(() => {
        axios.post('/new-message-total-count', formData)
        .then(response => {
          setNewMsgTotalCount(response.data)
        })
        .catch(error =>{
        })
      },1000) */
      
      // Set up the STOMP client
      const sockJSClient = new SockJS('/ws'); // Proxy설정으로 인해 http://localhost:8080 생략
      const stompClient = Stomp.over(sockJSClient);
      stompClient.connect({}, (frame) => {
        console.log(stompClient)
          setClient(stompClient);
          if(frame.command == 'CONNECTED') {
            setConnected(true);
          }
        });
      }
        /* useEffect 클린업 함수 */
        return () => {
          /* 로그아웃시 연결 종료된다. (렌더링 자체가 안되기 때문)*/
            console.log("연결종료!")
            client?.disconnect(); //연결 종료
          setConnected(false);
    };
  }, [userId])



    return (
      <div>
                {/* 버튼 영역 */}
                <div ref={chatOpenBtnRef} className="dm-icon-onoff-button" style={dmButtonOnStyle} onClick={(e)=>{
                  setChatFrameOnOff(true)
                  chatOpenBtnRef.current.style.display='none';
                  chatCloseBtnRef.current.style.display='flex';
                  // chatComponentRef.current.style.display='flex';
                }}>
                    <Messenger className="inline" size={30}  style={{width:"30px", height:"30px", background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)", color:"white", border:"none"}}/>
                    {newMsgTotalCount > 0 && 
                    <span style={{backgroundColor: '#fa3e3e', borderRadius: '50%', color: 'white', padding: '1px 8px', fontSize: '15px',position: 'absolute', bottom: '35px', right: '-5px'}}>
                      { newMsgTotalCount }
                    </span>
                    }
                </div>
                <div ref={chatCloseBtnRef} className="dm-icon-onoff-button" style={dmButtonOffStyle} onClick={(e)=>{
                  setChatFrameOnOff(false)
                  chatOpenBtnRef.current.style.display='flex';
                  chatCloseBtnRef.current.style.display='none';
                  // chatComponentRef.current.style.display='none';
                }}>
                    <X className="inline" size={30}  style={{width:"30px", height:"30px", background:"linear-gradient(rgba(247, 247, 248, 0.9) 0%, rgba(247, 247, 248, 0.9) 100%)", color:"rgba(0, 0, 0, 0.6)"}}/>
                </div>

                {/* 채팅 컴포넌트 */}
                <CSSTransition
                  in={chatFrameOnOff}
                  timeout={350}
                  classNames="NavAnimation"
                  unmountOnExit
                >
                <div ref={chatComponentRef} style={dmFrameStyle}>
                    <Chat chatFrameOnOff={chatFrameOnOff} client={client} connected={connected}/>
                </div>
                </CSSTransition>
          </div>
    )
}
const dmButtonOnStyle = {
  display: 'flex'
  /* 위치 */
  , position: 'fixed' //고정
  , zIndex: '10'
  , bottom: '30px'
  , right: '30px'
  /* 크기 및 색상 */
  , width:"50px"
  , height:"50px"
  , background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"
  , borderRadius:"43%"
  , border:'none'
  , justifyContent: 'center'
  , alignItems: 'center'
  , cursor: 'pointer'
  , transition: 'visibility 400ms ease 0s'
  , boxShadow: 'rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.15) 0px 8px 30px'
};
const dmButtonOffStyle = {
  display: 'none'
  /* 위치 */
  , position: 'fixed' //고정
  , zIndex: '10'
  , bottom: '30px'
  , right: '30px'
  /* 크기 및 색상 */
  , width:"50px"
  , height:"50px"
  , background:"linear-gradient(rgba(247, 247, 248, 0.9) 0%, rgba(247, 247, 248, 0.9) 100%)"
  , borderRadius:"43%"
  , border:'none'
  , justifyContent: 'center'
  , alignItems: 'center'
  , cursor: 'pointer'
  , transition: 'visibility 400ms ease 0s'
  , animation: '400ms cubic-bezier(0.36, 0, 0, 1) 0s 1 normal both running jiroXv'
  , boxShadow: 'rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.15) 0px 8px 30px'
};
const dmFrameStyle = {
  // display: 'flex'
   position: 'fixed' //고정
  , zIndex: '10'
  , bottom: "90px"
  , right: "30px"
  , textAlign:'left'
  , height: "calc(100% - 116px) !important"
  , background: '#f7f9fc'
  , boxShadow: 'rgba(255, 255, 255, 0.12) 0px 0px 2px 0px inset, rgba(0, 0, 0, 0.05) 0px 0px 2px 1px, rgba(0, 0, 0, 0.3) 0px 12px 60px'
};

