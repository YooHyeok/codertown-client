import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'react-bootstrap-icons';
import "react-chat-elements/dist/main.css"
import { MessageBox, ChatItem, Input } from "react-chat-elements"; // npm install react-chat-elements --save --force
import { useRef, useState, useEffect} from 'react';
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";

import {useTheme} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';//npm install --save react-swipeable-views --force


export default function Chat(props) {


    const userId = useSelector( (state) => {return state.UserId} );
    const [client, setClient] = useState(null);

    const [chatRoomList, setChatRoomList] = useState([]);
    const [chatRoomDetail, setChatRoomDetail] = useState({
    chatRoomData : null, chatRoomInfo : null
    });

    const textareaRef = useRef('');
    const chatContainerRef = useRef('');
    const [textareaValue, setTextareaValue] = useState('')

    const chatListRef = useRef('');
    const chatRoomRef = useRef('');  

    const [chatFrameOnOff, setChatFrameOnOff] = useState(props.chatFrameOnOff);

    const theme = useTheme();
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
    setValue(newValue);
    };

    const handleChangeIndex = (index) => {
    setValue(index);
    };

    /**
     * 채팅 목록 조회
     */
    const chatRoomListSearch = () => {
    const formData = new FormData();
        formData.append('loginEmail', userId)
        axios.post('/cokkiri-chat-list', formData)
        .then(response => {
            setChatRoomList(response.data.chatRomUserDtoList)
        })
        .catch(error =>{
        })
    }

    /**
     * 채팅 리스트 조회
     */
    useEffect(() => {
        let intervalId;
        if(chatFrameOnOff == true) {
        chatRoomListSearch();
        /* 5초에 한번씩 채팅 조회 */
        intervalId = setInterval(() => {
            console.log(chatFrameOnOff)
                chatRoomListSearch();
            },5000)
        }
        /* useEffect 클린업 함수 호출 */
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [chatFrameOnOff])

    useEffect(() => {
    return;
    // Set up the STOMP client
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

    const chatDetail = (e, obj) =>  {
      const formData = new FormData();
      formData.append('roomNo', obj.chatRoom.chatRoomNo)
      axios.post('/cokkiri-chat-detail', formData)
      .then(response => {
        setChatRoomDetail({chatRoomData:response.data, chatRoomInfo:obj})
        chatListRef.current.style.display='none';
        chatRoomRef.current.style.display='block';
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      })
      .catch(error =>{
      })
      
    }

    return (
        <div>
            <SwipeableViews
          containerStyle={{
              transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
            }}
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
            >
            {/* 1. 채팅 리스트 컴포넌트 */}
            <div ref={chatListRef} className="chat-list-div" index={0} style={{width:'450px', height:'586px', backgroundColor:'white', border : "1px solid lightgray", overflow:'auto',  }}>
                {
                chatRoomList.map(obj => {
                    return (
                    <div style={{width:'448px', borderBottom:'1px solid lightgray', height:'73px'}}>
                        <div style={{minWidth:'390px', float:'left'}}>
                        <ChatItem 
                            onClick={(e)=>{setChatFrameOnOff(false); chatDetail(e, obj); handleChange(e, 1)}}
                            avatar={`data:image/png;base64,${obj.chatRoom.chatUserList.filter(obj => obj.email !== userId)[0].profileUrl}`} 
                            title={obj.chatRoom.chatUserList.filter(obj => obj.email !== userId)[0].nickname}
                            subtitle={obj.chatRoom.lastChatMessage == null ? '파트신청 대화 신청':obj.chatRoom.lastChatMessage}
                            date={obj.chatRoom.lastChatMessageDate == null ? new Date(obj.chatRoom.lastChatMessageDate):new Date(obj.chatRoom.lastChatMessageDate)} 
                            unread={2}/>
                        </div>
                        <div style={{position:'relative', width:'57px', float:'right'}}>
                        <Button size={'sm'} color='danger' style={{ margin:'20px auto', }}>퇴장</Button>
                        </div>
                    </div>
                    )
                })
                }
            </div>

            {/* 2. 채팅방 입장 컴포넌트 */}
            <div ref={chatRoomRef} className="chat-into" index={1} style={{display:'none',width:'450px', height:'586px', backgroundColor:'white', border : "1px solid lightgray"}}>
                {/* 1. 채팅방 제목 영역*/}
                {chatRoomRef.current != '' && chatRoomRef.current.style.display == 'block' && /* 채팅입장 컴포넌트가 열렸을때 - 추후 컴포넌트화 */
                <div>
                {/* 뒤로가기 버튼 영역 */}
                <div style={{width:'448px', height:'73px', backgroundColor:'white', borderBottom : "1px solid lightgray"}}>
                    <ChevronLeft onClick={(e)=>{
                        chatListRef.current.style.display='block';
                        chatRoomRef.current.style.display='none';
                        setChatFrameOnOff(true);
                        handleChange(e, 0)
                    }} 
                    style={{float:'left', margin: "20px auto", width:"30px", height:"30px", cursor:'pointer'}}/>
                <div className="chat-into-header" style={{ width:'360px', float:'left'}}>
                    <ChatItem
                        avatar={`data:image/png;base64,${chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.email !== userId)[0].profileUrl}`}
                        title={chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.email !== userId)[0].nickname}
                        subtitle={chatRoomDetail.chatRoomInfo.chatRoom.lastChatMessage == null ? '파트신청 대화 요청':chatRoomDetail.chatRoomInfo.chatRoom.lastChatMessage}
                        date={new Date()}
                        unread={0}
                    />
                </div>
                <div style={{position:'relative', width:'57px', float:'right'}}>
                    <Button size={'sm'} color='danger' style={{ margin:'20px auto', }}>퇴장</Button>
                </div>
                </div>
                {/* 프로젝트 정보 */}
                <div style={{width:'448px', height:'73px', backgroundColor:'white', borderBottom : "1px solid lightgray"}}>
                <div style={{width:"50px",margin:'10px 0 0 50px', float:'left'}}>
                    <ul /* id={"Tooltip" + obj.recruitDto.recruitNo} onMouseEnter={() => toggleTooltip(obj.recruitDto.recruitNo)} onMouseLeave={() => toggleTooltip(obj.recruitDto.recruitNo)} */
                    className="main_project_part_list_ul" style={{width:'240px', listStyle: 'none', margin:'0px', padding: '0'}}>
                        <li className='main_project_part_list_li'>{chatRoomDetail.chatRoomData.projectPart.partName}</li>
                    </ul>
                </div>
                <div style={{width:"250px",marginTop:'8px', float:'left'}}>
                    {/* 프로젝트 제목 */}
                    <Link style={{textDecoration:'none', color:'#212529BF'}}>
                        <b>{chatRoomDetail.chatRoomData.project.projectTitle}</b>
                    </Link>
                </div>
                <div style={{position:'relative', width:'57px', float:'right'}}>
                    {chatRoomDetail.chatRoomInfo.isRoomMaker && 
                    <Button size={'sm'} style={{ margin:'20px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>수락</Button>}
                    {!chatRoomDetail.chatRoomInfo.isRoomMaker && !chatRoomDetail.chatRoomData.isConfirm  && 
                    <p style={{margin:'10px auto', width:'32px' }}>수락 <br/> 대기</p>}
                    {!chatRoomDetail.chatRoomInfo.isRoomMaker && chatRoomDetail.chatRoomData.isConfirm  && 
                    <p style={{margin:'10px auto', width:'32px', color:'rgb(104, 97, 236)' }}>수락 <br/> 완료</p>}
                </div>
                </div>

                {/* 1. 채팅방 대화내용 리스트 영역 */}
                <div ref={chatContainerRef} className="chat-into-body" style={{width:'448px', height:'380px', minHeight:'296px', overflow:'auto', backgroundColor:'white', borderBottom : "1px solid lightgray"}}>
                { chatRoomDetail.chatRoomData != null && chatRoomDetail.chatRoomData.chatMessageDtoList.length == 0 &&
                    <div style={{width:'100px', height:'50px', margin:'162px auto'}}>채팅 데이터 없음</div>
                }
                { chatRoomDetail.chatRoomData != null && chatRoomDetail.chatRoomData.chatMessageDtoList.length > 0 &&
                    chatRoomDetail.chatRoomData.chatMessageDtoList.map(obj => {
                    return(
                        <MessageBox 
                        position={obj.sender.email == userId ? 'right' : 'left'}  
                        title={obj.sender}  
                        type='text'  
                        text={obj.message}  
                        date={new Date()} 
                        replyButton={obj.sender.email == userId ? false : true}/>
                        )
                    })
                }
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
            }
            </div>
            </SwipeableViews>
        </div>
    )
}