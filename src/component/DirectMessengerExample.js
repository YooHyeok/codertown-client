import { Button } from 'reactstrap';
import { Messenger, X, ChevronLeft } from 'react-bootstrap-icons';
import "react-chat-elements/dist/main.css"
import { MessageBox, ChatList, ChatItem, Input } from "react-chat-elements";

import { useRef, useState, useEffect} from 'react';

import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

// npm install react-chat-elements --save --force
export default function DirectMessengerExample() {

  const [client, setClient] = useState(null);
  const [chat, setChat] = useState('');

  useEffect(() => {
    // Set up the STOMP client
    return; // 채팅 연결 임시 중단
    const sockJSClient = new SockJS('/ws'); // Proxy설정으로 인해 http://localhost:8080 생략
    const stompClient = Stomp.over(sockJSClient);

    stompClient.connect({}, (frame) => {
        setClient(stompClient);
        const messageData = {
          sender: '보내는 사람', // 보내는 사람의 이름 또는 ID로 수정
          content: '연결 성공',
      };
        stompClient.send(`/dm-pub/chat/connect`, {}, JSON.stringify(messageData)); // 데이터 전송
        stompClient.subscribe('/connected-success', function (e) { //데이터 수신
          //e.body에 전송된 data가 들어있다 JSON Text형태이므로 parsing한 후 props에 접근한다.
          alert(JSON.parse(e.body).content); /* 최초연결 성공 시점 (새로고침해도 출력안된다)*/
      });
    });
    /* 로그아웃시 연결 종료된다. */
    return () => {
        if (stompClient) {
          stompClient.disconnect(); //연결 종료
        }
    }
  }, []);

  /* 메시지 구독  */
  useEffect(() => {
    if (client) {
        client.subscribe('/connected-success', function (e) {
          //e.body에 전송된 data가 들어있다
          console.log(JSON.parse(e.body))
          // showMessage(JSON.parse(e .body));
      });
    }
  }, [client]);

  const publish = (chat) => {
    // if (!client.current.connected) return;
    const messageData = {
      sender: '보내는 사람', // 보내는 사람의 이름 또는 ID로 수정
      content: textareaValue,
  };
    client.send("/dm-pub/project-request", {}, textareaValue);
    // client.send("/dm-pub/chat/connect", messageData, JSON.stringify(messageData));
    setTextareaValue('');
}


    const textareaRef = useRef('');
    const chatContainerRef = useRef('');
    const [textareaValue, setTextareaValue] = useState('')
    const chatOpenBtnRef = useRef('');
    const chatCloseBtnRef = useRef('');
    const chatComponentRef = useRef('');  
    const chatListRef = useRef('');
    const chatRoomRef = useRef('');  


    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [textareaValue]);



  /* 댓글 [입력] Change 이벤트 메소드 */
    const textAreaInputChange = (e) => {
        setTextareaValue(e.target.value)
        if (e.target.value == '') {
          textareaRef.current.style.height = '30px';
          textareaRef.current.value = null;
          chatContainerRef.current.style.height = '380px';
          return;
        }
    }
    const textAreaInputKeyDown= (e, stompClient) => {
      
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault(); // 엔터 키의 기본 동작 방지
        // Shift + Enter를 눌렀을 때 줄개행
        setTextareaValue(textareaValue + '\n');
        textareaRef.current.style.overflow = 'auto';
        textareaRef.current.style.height = 'auto';
        console.log(textareaRef.current.scrollHeight)
        textareaRef.current.style.height = (30+textareaRef.current.scrollHeight) + 'px';
        chatContainerRef.current.style.height = 'auto';
        chatContainerRef.current.style.height = `calc(408px - ${textareaRef.current.scrollHeight}px)`;
        return;
      } 
      
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // 엔터 키의 기본 동작 방지
        // 여기에 메시지 전송 로직 추가
        // 메시지 전송 후 입력창 초기화
        setTextareaValue('');
        publish(textareaValue);
        chatContainerRef.current.style.height = '380px';
        textareaRef.current.style.height = '30px'; // 초기 높이로 설정
        return;
      }
      
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

      const dataSource = [
        {
          avatar: `profileImage/${'yjou7454@gmail.com'}`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'yjou7454', //사용자 이름
          subtitle: "프론트앤드 자리 신청 수락요청 메시지", //마지막 대화 내용
          date: new Date(),
          unread: 3, // 읽지 않은 대화 갯수
        },
        {
          avatar: `/default_profile.png`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'Kursat', //사용자 이름
          subtitle: "Why don't we go to the No Way Home movie this weekend ?", //마지막 대화 내용
          date: new Date(),
          unread: 3, // 읽지 않은 대화 갯수
        },
        {
          avatar: `/default_profile.png`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'Kursat', //사용자 이름
          subtitle: "Why don't we go to the No Way Home movie this weekend ?", //마지막 대화 내용
          date: new Date(),
          unread: 3, // 읽지 않은 대화 갯수
        },
        {
          avatar: `/default_profile.png`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'Kursat', //사용자 이름
          subtitle: "Why don't we go to the No Way Home movie this weekend ?", //마지막 대화 내용
          date: new Date(),
          unread: 3, // 읽지 않은 대화 갯수
        },
        {
          avatar: `/default_profile.png`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'Kursat', //사용자 이름
          subtitle: "Why don't we go to the No Way Home movie this weekend ?", //마지막 대화 내용
          date: new Date(),
          unread: 3, // 읽지 않은 대화 갯수
        },
        {
          avatar: `/default_profile.png`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'Kursat', //사용자 이름
          subtitle: "Why don't we go to the No Way Home movie this weekend ?", //마지막 대화 내용
          date: '어제',
          unread: 3, // 읽지 않은 대화 갯수
        },
        {
          avatar: `/default_profile.png`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'Kursat', //사용자 이름
          subtitle: "Why don't we go to the No Way Home movie this weekend ?", //마지막 대화 내용
          date: new Date(),
          // unread: 3, // 읽지 않은 대화 갯수
        },
        {
          avatar: `/default_profile.png`, //`profileImage/${webdevyoo@gmail.com}`
          alt: 'kursat_avatar',
          title: 'Kursat', //사용자 이름
          subtitle: "Why don't we go to the No Way Home movie this weekend ?", //마지막 대화 내용
          date: new Date(),
          // unread: 3, // 읽지 않은 대화 갯수
        },
    ]

    return (<div>
                {/* 버튼 영역 */}
                <div ref={chatOpenBtnRef} className="dm-icon-open-button" style={dmButtonOnStyle} onClick={(e)=>{
                  chatOpenBtnRef.current.style.display='none';
                  chatCloseBtnRef.current.style.display='flex';
                  chatComponentRef.current.style.display='flex';
                }}>
                    <Messenger className="inline" size={30}  style={{width:"30px", height:"30px", background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)", color:"white", border:"none"}}/>
                </div>
                <div ref={chatCloseBtnRef} className="dm-icon-close-button" style={dmButtonOffStyle} onClick={(e)=>{
                  chatOpenBtnRef.current.style.display='flex';
                  chatCloseBtnRef.current.style.display='none';
                  chatComponentRef.current.style.display='none';
                }}>
                    <X className="inline" size={30}  style={{width:"30px", height:"30px", background:"linear-gradient(rgba(247, 247, 248, 0.9) 0%, rgba(247, 247, 248, 0.9) 100%)", color:"rgba(0, 0, 0, 0.6)"}}/>
                </div>

                {/* 채팅 컴포넌트 */}
                <div ref={chatComponentRef} style={dmFrameStyle}>

                    {/* 1. 채팅 리스트 컴포넌트 */}
                    <div ref={chatListRef} className="chat-list-div" style={{width:'450px', height:'513px', backgroundColor:'white', border : "1px solid lightgray", overflow:'auto',  }}>

                      {/* <ChatList className='chat-list' dataSource={dataSource} /> */}
                      <div style={{width:'430px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left'}}>
                          <ChatItem onClick={(e)=>{
                            chatListRef.current.style.display='none';
                            chatRoomRef.current.style.display='block';
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                          }}
                          avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="프론트앤드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right'}}>
                          <Button size={'sm'} style={{ margin:'20px  auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>수락</Button>
                        </div>
                      </div>
                      <div style={{width:'430px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left',}}>
                          <ChatItem avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="백엔드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right'}}>
                          <p style={{margin:'10px auto', width:'32px' }}>수락 <br/> 대기</p>
                        </div>
                      </div>
                      <div style={{width:'430px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left',}}>
                          <ChatItem avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="프론트앤드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right'}}>
                          <p style={{margin:'10px auto', width:'32px', color:'rgb(104, 97, 236)' }}>수락 <br/> 완료</p>
                        </div>
                      </div>
                      <div style={{width:'430px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left',}}>
                          <ChatItem avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="프론트앤드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right'}}>
                          <p style={{margin:'10px auto', width:'32px', color:'rgb(104, 97, 236)' }}>참여 <br/> 완료</p>
                        </div>
                      </div>
                      <div style={{width:'430px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left',}}>
                          <ChatItem avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="백앤드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right'}}>
                          <Button size={'sm'} style={{ margin:'20px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>수락</Button>
                        </div>
                      </div>
                      <div style={{width:'430px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left',}}>
                          <ChatItem avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="프론트앤드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right' }}>
                          <Button size={'sm'} style={{ margin:'20px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>수락</Button>
                        </div>
                      </div>
                      <div style={{width:'430px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left',}}>
                          <ChatItem avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="프론트앤드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right' }}>
                          <Button size={'sm'} style={{ margin:'20px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>수락</Button>
                        </div>
                      </div>
                      
                      <div style={{width:'431px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left',}}>
                          <ChatItem avatar={`profileImage/${'webdevyoo@gmail.com'}`} title="webdevyoo" subtitle="프론트앤드 참여 신청 수락요청 메시지" date={new Date()} unread={2}/>
                        </div>
                        <div style={{position:'relative', float:'right'}}>
                          <p style={{margin:'10px auto', width:'32px', color:'rgb(104, 97, 236)' }}>참여 <br/> 완료</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. 채팅방 입장 컴포넌트 */}
                    <div ref={chatRoomRef} className="chat-into" style={{display:'none',width:'450px', height:'513px', backgroundColor:'white', border : "1px solid lightgray"}}>
                      {/* 1. 채팅방 제목 영역*/}
                      <div style={{width:'448px', height:'73px', backgroundColor:'white', borderBottom : "1px solid lightgray"}}>
                          <ChevronLeft onClick={(e)=>{
                            chatListRef.current.style.display='block';
                            chatRoomRef.current.style.display='none';
                          }} 
                          style={{float:'left', margin: "20px auto", width:"30px", height:"30px", cursor:'pointer'}}/>
                        <div className="chat-into-header" style={{ width:'360px', float:'left'}}>
                          <ChatItem
                              avatar={`profileImage/${'webdevyoo@gmail.com'}`}
                              title="webdevyoo"
                              subtitle=""
                              date={new Date()}
                              unread={0}
                            />
                        </div>
                        <div style={{position:'relative', width:'57px', float:'right'}}>
                          <Button size={'sm'} style={{ margin:'20px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>수락</Button>
                        </div>
                      </div>

                      {/* 1. 채팅방 대화내용 리스트 영역 */}
                      <div ref={chatContainerRef} className="chat-into-body" style={{width:'448px', height:'380px', minHeight:'296px', overflow:'auto', backgroundColor:'white', borderBottom : "1px solid lightgray"}}>
                        {/* 상대방 메시지박스 */}
                        <MessageBox position='left'  title='Burhan'  type='text'  text="Hi there !"  date={new Date()}  replyButton={true}/>
                        {/* 메시지박스 */}
                        <MessageBox position="right" title="Emre" type="text" text="Click to join the meeting" date={new Date()} />
                        {/* 상대방 메시지박스 */}
                        <MessageBox position='left'  title='Burhan'  type='text'  text="Hi there !"  date={new Date()}  replyButton={true}/>
                        {/* 메시지박스 */}
                        <MessageBox position="right" title="Emre" type="text" text="Click to join the meeting" date={new Date()} />
                        {/* 상대방 메시지박스 */}
                        <MessageBox position='left'  title='Burhan'  type='text'  text="Hi there !"  date={new Date()}  replyButton={true}/>
                        {/* 메시지박스 */}
                        <MessageBox position="right" title="Emre" type="text" text="Click to join the meeting" date={new Date()} />
                      </div>

                      {/* 2. 채팅방 대화 전송 영역 */}
                      <div className="chat-into-footer" style={{width:'448px', minHeight:'48px', overflow:'hidden', backgroundColor:'white'/* , borderBottom : "1px solid lightgray" */}}>
                        <div style={{width:"430px", minHeight:'30px', margin:'4px auto', maxHeight:"112px !important"}}>
                            <textarea rows={1} ref={textareaRef} onChange={textAreaInputChange} onKeyDown={textAreaInputKeyDown} value={textareaValue}  placeholder='내용을 입력하세요'
                              style={{float:'left', display:'flex', width:'385px', height:'30px', maxHeight:"114px", margin:"10px auto", resize: 'none', outlineStyle:'none', overflow:'hidden', border: '0.1px solid lightgray'}}/>
                            <Button size={'sm'} style={{float:'right', margin:'10px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>전송</Button>
                        </div>
                      </div>

                  </div>

              </div>
          </div>
    )

}