import { Messenger, X } from 'react-bootstrap-icons';
import "react-chat-elements/dist/main.css"
import { useRef, useState } from 'react';
import Chat from './Chat.js';

export default function MessengerFrame() {

  const chatOpenBtnRef = useRef('');
  const chatCloseBtnRef = useRef('');
  const chatComponentRef = useRef('');  
  const [chatFrameOnOff, setChatFrameOnOff] = useState(false);

    return (<div>
                {/* 버튼 영역 */}
                <div ref={chatOpenBtnRef} className="dm-icon-open-button" style={dmButtonOnStyle} onClick={(e)=>{
                  chatOpenBtnRef.current.style.display='none';
                  chatCloseBtnRef.current.style.display='flex';
                  chatComponentRef.current.style.display='flex';
                  setChatFrameOnOff(true)
                }}>
                    <Messenger className="inline" size={30}  style={{width:"30px", height:"30px", background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)", color:"white", border:"none"}}/>
                </div>
                <div ref={chatCloseBtnRef} className="dm-icon-close-button" style={dmButtonOffStyle} onClick={(e)=>{
                  chatOpenBtnRef.current.style.display='flex';
                  chatCloseBtnRef.current.style.display='none';
                  chatComponentRef.current.style.display='none';
                  setChatFrameOnOff(false)
                }}>
                    <X className="inline" size={30}  style={{width:"30px", height:"30px", background:"linear-gradient(rgba(247, 247, 248, 0.9) 0%, rgba(247, 247, 248, 0.9) 100%)", color:"rgba(0, 0, 0, 0.6)"}}/>
                </div>

                {/* 채팅 컴포넌트 */}
                <div ref={chatComponentRef} style={dmFrameStyle}>
                  {console.log(chatFrameOnOff)}
                  {
                    chatFrameOnOff && <Chat chatFrameOnOff={chatFrameOnOff}/>
                  }
                </div>
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
  display: 'none'
  , position: 'fixed' //고정
  , zIndex: '10'
  , bottom: "90px"
  , right: "30px"
  , textAlign:'left'
  , height: "calc(100% - 116px) !important"
  , boxShadow: 'rgba(255, 255, 255, 0.12) 0px 0px 2px 0px inset, rgba(0, 0, 0, 0.05) 0px 0px 2px 1px, rgba(0, 0, 0, 0.3) 0px 12px 60px'
};

