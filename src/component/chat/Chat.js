import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'react-bootstrap-icons';
import "react-chat-elements/dist/main.css"
import { MessageBox, ChatItem } from "react-chat-elements"; // npm install react-chat-elements --save --force
import { useRef, useState, useEffect} from 'react';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";
import {useTheme} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';//npm install --save react-swipeable-views --force

export default function Chat(props) {
       
    const userId = useSelector( (state) => {return state.UserId} );
    const [chatRoomList, setChatRoomList] = useState([]);
    const [chatMessageList, setChatMessageList] = useState([]);
    const [chatRoomDetail, setChatRoomDetail] = useState({
        chatRoomData : null, chatRoomInfo : null
    });

    const [isConnectedFriend, setIsConnectedFriend] = useState(false)

    const textareaRef = useRef('');
    const chatContainerRef = useRef('');
    const [textareaValue, setTextareaValue] = useState('')

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
     * 채팅방 목록 조회
     */
    const chatRoomListSearch = () => {
         const formData = new FormData();
        formData.append('loginEmail', userId)
        axios.post('/cokkiri-chat-list', formData)
        .then(response => {
            setChatRoomList(response.data.chatRomUserDtoList)
            setFlag({...flag, chatListData:true})
        })
        .catch(error =>{
        })
    }


    /**
     * 채팅 메시지 목록 조회
     */
    const chatMessageListSearch = () => {
        const formData = new FormData();
        formData.append('roomNo', chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo)
        axios.post('/chat-message-list', formData)
        .then(response => {
            setChatMessageList(response.data)
        })
        .catch(error =>{
        })
    }

    /**
     * 채팅방 리스트 조회
     */
    useEffect(() => {
        let intervalId;
        if(chatFrameOnOff == true) {
            chatRoomListSearch();
            /* 5초에 한번씩 채팅 조회 */
            intervalId = setInterval(() => {
                    chatRoomListSearch();
                },1000)
        }

        /* useEffect 클린업 함수 호출 */
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };

    }, [chatFrameOnOff])
        
    /* 채팅방 입장 후 상세 내용(메시지리스트) 조회 메소드 */
    const chatDetail = (e, obj) =>  {
    setIsConnectedFriend(obj.chatRoom.chatUserList.filter(obj => obj.userDto.email != userId)[0].isConnectedRoom)
      const formData = new FormData();
      formData.append('roomNo', obj.chatRoom.chatRoomNo)
      formData.append('loginId', userId)
      axios.post('/cokkiri-chat-detail', formData)
      .then(response => {
        setChatRoomDetail({chatRoomData:response.data, chatRoomInfo:obj})
        setFlag({...flag, chatListFrame:false, chatRoomFrame:true})
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      })
      .catch(error =>{
      })
      
    }

    const [flag, setFlag] = useState({chatListFrame:true, chatListData:false, chatRoomFrame: false})
    

    useEffect(() => {
        // let isConnected = false;
        if (flag.chatRoomFrame && props.client) {
            chatMessageListSearch();
            let friend = chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.userDto.email != userId)[0].userDto.email
            const subscribeConnected = props.client.subscribe(`/connected/room.${chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo}/user.${friend}`, function (e) {
                //e.body에 전송된 data가 들어있다
                setIsConnectedFriend(JSON.parse(e.body)); // 여기서 비동기처리되서... messege구독시에 원하는 데이터를 못가져온다...
                // isConnected = JSON.parse(e.body);
                chatMessageListSearch(); //상대방 접속시 리스트 재 조회로 읽음처리

            },{
                "connectedRoomId":chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo,
                "connectedUserEmail":userId,
            });

            /* 채팅 메시지 구독 */
            const subscribeMessage = props.client.subscribe(`/sub/room.${chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo}`, function (e) {
                //e.body에 전송된 data가 들어있다
                /* const receivedData = JSON.parse(e.body);
                const parsedData = {
                    ...receivedData,
                    isReaded: isConnected  // 사용하려는 값은 연결된 친구의 상태입니다.
                }; */
                setChatMessageList(prevMessages => [...prevMessages, JSON.parse(e.body)]); //기존 state배열을 복사한 후 새로운 데이터를 추가하여 state 상태 업데이트
                chatMessageListSearch();
            });

            /* confirm여부 구독 */
            let subscribeConfirm = null;
            if(chatRoomDetail.chatRoomInfo.isRoomMaker) { //RoomMaker이면 구독
                subscribeConfirm = props.client.subscribe(`/confirm/room.${chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo}/user.${userId}`, function (e) {
                    //e.body에 전송된 data가 들어있다
                    setChatRoomDetail({...chatRoomDetail, 
                        chatRoomData: {
                            ...chatRoomDetail.chatRoomData,
                            isConfirm: JSON.parse(e.body)
                        } 
                    }) 
                });            
            }
            /* 새로고침시 구독취소 */
            window.addEventListener('beforeunload',  (e) => {
                if(!e.persisted && subscribeConnected) {
                    subscribeConnected.unsubscribe({
                        "connectedRoomId":chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo,
                        "connectedUserEmail":userId,
                    })
                }
            });

            // 클리너 함수 등록하여 컴포넌트 언마운트 시 구독 해제
            return () => {
                if (subscribeConnected) {
                    subscribeConnected.unsubscribe({
                        "connectedRoomId":chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo,
                        "connectedUserEmail":userId,
                    });
                }
                if (subscribeMessage) {
                    subscribeMessage.unsubscribe();
                }
                if (subscribeConfirm) {
                    subscribeConfirm.unsubscribe();
                }
            };
        }
    }, [flag.chatRoomFrame, props.client]);

    /* 스크롤 최 하단.... */
    useEffect(() => {
        if (flag.chatRoomFrame) {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }

        }
    }, [chatMessageList]);
    
    /**
     * 채팅 입력시 입력창 높이를 조절한다.
     */
    useEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [textareaValue]);
  
    /* 채팅 [입력] Change 이벤트 메소드 */
    const textAreaInputChange = (e) => {
        setTextareaValue(e.target.value)
        if (e.target.value == '') {
        textareaRef.current.style.height = '30px';
        textareaRef.current.value = null;
        chatContainerRef.current.style.height = '380px';
        return;
        }
    }

    const textAreaInputKeyDown= (e, chatRoomNo) => {
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
          publishMessage(textareaValue, chatRoomNo);
          chatContainerRef.current.style.height = '380px';
          textareaRef.current.style.height = '30px'; // 초기 높이로 설정
          return;
        }
      }

    const publishMessage = (chat, roomId) => {
        if (chat?.trim()) {
            let chatData = {
                roomId: roomId,
                senderId: userId,
                message: chat,
                isConnectedFriend: isConnectedFriend
            }
            props.client?.publish(
                {
                    destination: '/pub/chat.message',
                    body: JSON.stringify(chatData)
                }
            );
            setTextareaValue('');
        }
            
    }

    const publishConfirm = (chatRoomDetail) => {
            // let requesterEmail = chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj=> obj.email !== userId)[0].email
            let requesterEmail = chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.userDto.email != userId)[0].userDto.email
            let projectPartNo = chatRoomDetail.chatRoomData.projectPart.projectPartNo
            let publishData = {
                chatRoomNo: chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo,
                requesterEmail: requesterEmail,
                projectPartNo: projectPartNo,
            }
            props.client?.publish(
                {
                    destination: '/pub/chat.confirm',
                    body: JSON.stringify(publishData)
                }
            );
            setChatRoomDetail({...chatRoomDetail, 
                chatRoomData: {
                    ...chatRoomDetail.chatRoomData,
                    isConfirm: true
                } 
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
                {props.connected === true ?
                    flag.chatListFrame === true ?
                    (
                    <div  className="chat-list-div" index={0} style={{width:'450px', height:'586px', backgroundColor:'#f7f9fc', border : "1px solid lightgray", overflow:'auto',  }}>
                        {flag.chatListData === true ? 
                            (chatRoomList.length > 0 ? 
                                (chatRoomList.map(obj => {

                                    return (
                                    <div style={{width:'448px', borderBottom:'1px solid lightgray', height:'73px', backgroundColor:'white'}}>
                                        <div style={{minWidth:'390px', float:'left'}}>
                                        <ChatItem 
                                            onClick={(e)=>{setChatFrameOnOff(false); chatDetail(e, obj); handleChange(e, 1)}}
                                            // avatar={`data:image/png;base64,${obj.chatRoom.chatUserList.filter(obj => obj.userDto.email !== userId)[0].profileUrl}`} 
                                            avatar={`data:image/png;base64,${obj.chatRoom.chatUserList.filter(obj => obj.userDto.email != userId)[0].userDto.profileUrl}`} 
                                            // title={obj.chatRoom.chatUserList.filter(obj => obj.email !== userId)[0].nickname}
                                            title={obj.chatRoom.chatUserList.filter(obj => obj.userDto.email != userId)[0].userDto.nickname}
                                            subtitle={obj.chatRoom.lastChatMessage == null ? '파트신청 대화 신청':obj.chatRoom.lastChatMessage}
                                            date={obj.chatRoom.lastChatMessageDate == null ? new Date(obj.chatRoom.lastChatMessageDate):new Date(obj.chatRoom.lastChatMessageDate)} 
                                            unread={obj.newMsgCount}/>
                                        </div>
                                        <div style={{position:'relative', width:'57px', float:'right'}}>
                                        <Button size={'sm'} color='danger' style={{ margin:'20px auto', }}>퇴장</Button>
                                        </div>
                                    </div>
                                    )
                                }))
                                : 
                                (<div style={{width:'448px', marginTop:'250px', textAlign:'center'}}>참여중인 채팅방이 없습니다.</div>)
                            )
                            : 
                            (<div style={{width:'448px', marginTop:'250px', textAlign:'center'}}>채팅방 로딩중...</div>)
                        }
                    </div>
                    ) 
                    :
                    /* flag값이 false이면 빈 div를 출력한다 */
                    (<div/>) 
                :
                (<div className="chat-list-div" index={0} style={{width:'450px', height:'586px', backgroundColor:'white', border : "1px solid lightgray", overflow:'auto',  }}>
                    <div style={{width:'448px', marginTop:'250px', textAlign:'center'}}>채팅 연결중 입니다.</div>
                </div>)
                }

                {/* 2. 채팅방 입장 컴포넌트 */}
                {flag.chatRoomFrame === true ? ( /* 채팅입장 컴포넌트가 열렸을때 - 추후 컴포넌트화 */
                <div ref={chatRoomRef} className="chat-into" index={1} style={{width:'450px', height:'586px', backgroundColor:'white', border : "1px solid lightgray"}}>
                    {/* 1. 채팅방 제목 영역*/}
                    <div>
                        {/* 뒤로가기 버튼 영역 */}
                        <div style={{width:'448px', height:'73px', backgroundColor:'white', borderBottom : "1px solid lightgray"}}>
                            <ChevronLeft onClick={(e)=>{

                                setFlag({...flag, chatListFrame:true, chatRoomFrame:false})
                                setChatFrameOnOff(true);
                                handleChange(e, 0)
                            }} 
                            style={{float:'left', margin: "20px auto", width:"30px", height:"30px", cursor:'pointer'}}/>
                        <div className="chat-into-header" style={{ width:'360px', float:'left'}}>
                            <ChatItem
                                // avatar={`data:image/png;base64,${chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.email !== userId)[0].profileUrl}`}
                                // title={(isConnectedFriend ? '🟢' : '🔴')  + chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.email !== userId)[0].nickname}
                                avatar={`data:image/png;base64,${chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.userDto.email != userId)[0].userDto.profileUrl}`}
                                title={(isConnectedFriend ? '🟢' : '🔴')  + chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj => obj.userDto.email != userId)[0].userDto.nickname}
                                // subtitle={chatRoomDetail.chatRoomInfo.chatRoom.lastChatMessage == null ? '파트신청 대화 요청':chatRoomDetail.chatRoomInfo.chatRoom.lastChatMessage}
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
                            {!chatRoomDetail.chatRoomInfo.isRoomMaker && !chatRoomDetail.chatRoomData.isConfirm && //룸메이커는 신청자 이므로 신청자가 아닌사람이 수락한다.
                            <Button size={'sm'} style={{ margin:'20px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}
                                    onClick={()=> {
                                        publishConfirm(chatRoomDetail)
                                        // let requesterEmail = chatRoomDetail.chatRoomInfo.chatRoom.chatUserList.filter(obj=> obj.email !== userId)[0].email
                                        // const requestJson = {requesterEmail:requesterEmail, projectPartNo:chatRoomDetail.chatRoomData.projectPart.projectPartNo}
                                        // axios.post('/project/join-confirm', requestJson)
                                        // .then((response)=>{
                                        //     console.log(response)
                                        // })
                                        // .catch((error)=>{
                                            
                                        // })
                                    }}>수락</Button>}
                            {chatRoomDetail.chatRoomInfo.isRoomMaker && !chatRoomDetail.chatRoomData.isConfirm  && 
                            <p style={{margin:'10px auto', width:'32px' }}>수락 <br/> 대기</p>}
                            {!chatRoomDetail.chatRoomInfo.isRoomMaker && chatRoomDetail.chatRoomData.isConfirm  && //팀장에게 보여준다.
                            <p style={{margin:'10px auto', width:'32px', color:'rgb(104, 97, 236)' }}>수락 <br/> 완료</p>}
                            {chatRoomDetail.chatRoomInfo.isRoomMaker && chatRoomDetail.chatRoomData.isConfirm  && //신청자에게 함께 보여준다.
                            <p style={{margin:'10px auto', width:'32px', color:'rgb(104, 97, 236)' }}>참여 <br/> 완료</p>}
                        </div>
                    </div>

                    {/* 1. 채팅방 대화내용 리스트 영역 */}
                    <div ref={chatContainerRef} className="chat-into-body" style={{width:'448px', height:'380px', minHeight:'296px', overflow:'auto', backgroundColor:'#f7f9fc', borderBottom : "1px solid lightgray"}}>
                    { chatMessageList.length == 0 &&
                        <div style={{width:'100px', height:'50px', margin:'162px auto'}}>채팅 데이터 없음</div>
                    }
                    { chatMessageList.length > 0 &&
                        chatMessageList.map(obj =>  {
                                return (
                                obj.sender.email === userId ? 
                                /* 나의 메시지 */
                                (<MessageBox 
                                    position={'right'}  
                                    type='text'
                                    title={obj.sender.nickname}  
                                    text={obj.message}  
                                    status={obj.isReaded ? 'read' : 'received'}
                                    date={obj.chatSendDate} />)
                                :
                                /* 상대방 메시지 */
                                (<MessageBox 
                                    position={'left'}  
                                    type='text'
                                    title={obj.sender.nickname}  
                                    text={obj.message}  
                                    date={obj.chatSendDate} />)
                                )
                            }
                        )
                    }
                    </div>
                    {/* 2. 채팅방 대화 전송 영역 */}
                    <div className="chat-into-footer" style={{width:'448px', minHeight:'48px', overflow:'hidden', backgroundColor:'white'/* , borderBottom : "1px solid lightgray" */}}>
                    <div style={{width:"430px", minHeight:'30px', margin:'4px auto', maxHeight:"112px !important"}}>
                        <textarea rows={1} ref={textareaRef} onChange={textAreaInputChange} onKeyDown={(e)=>{
                            textAreaInputKeyDown(e, chatRoomDetail.chatRoomInfo.chatRoom.chatRoomNo)}} value={textareaValue}  placeholder='내용을 입력하세요'
                            style={{float:'left', display:'flex', width:'385px', height:'30px', maxHeight:"114px", margin:"10px auto", resize: 'none', outlineStyle:'none', overflow:'hidden', border: '0.1px solid lightgray'}}/>
                        <Button size={'sm'} style={{float:'right', margin:'10px auto', background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"}}>전송</Button>
                    </div>
                    </div>
                    </div>
                </div>
                ) : (<div/>)}
            </SwipeableViews>
        </div>
    )
}