import { useRef, useState, useEffect} from 'react';
import { MessageBox, ChatItem, Input } from "react-chat-elements"; // npm install react-chat-elements --save --force
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from "axios";

export default function ChatList() {
    const userId = useSelector( (state) => {return state.UserId} );

    const [chatRoomDetail, setChatRoomDetail] = useState({
        chatRoomData : null, chatRoomInfo : null
    });

    const chatContainerRef = useRef('');

    return(
    <div ref={chatContainerRef} className="chat-into-body" style={{width:'448px', height:'380px', minHeight:'296px', overflow:'auto', backgroundColor:'white', borderBottom : "1px solid lightgray"}}>
        { chatRoomDetail.chatRoomData != null && chatRoomDetail.chatRoomData.chatMessageDtoList.length == 0 &&
            <div style={{width:'100px', height:'50px', margin:'162px auto'}}>채팅 데이터 없음</div>
        }
        { chatRoomDetail.chatRoomData != null && chatRoomDetail.chatRoomData.chatMessageDtoList.length > 0 &&
            chatRoomDetail.chatRoomData.chatMessageDtoList.map(obj => {
            return(
                <MessageBox 
                position={obj.sender.email == userId ? 'right' : 'left'}  
                title={obj.sender.nickname}  
                type='text'  
                text={obj.message}  
                date={obj.chatSendDate} 
                replyButton={obj.sender.email == userId ? false : true}/>
                )
            })
        }
    </div>
    )
}
