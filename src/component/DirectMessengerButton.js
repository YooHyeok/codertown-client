import { Messenger } from 'react-bootstrap-icons';


export default function DirectMessengerButton() {
    const dmButtonStyle = {
        display: 'flex'
        // , flexWrap: 'nowrap'
        // , width: 'auto'
        /* 위치 */
        , position: 'fixed' //고정
        , zIndex: '10'
        , bottom: '150px'
        , right: '100px'
        /* 크기 및 색상 */
        , width:"60px"
        , height:"60px"
        // , backgroundColor:"#8B00FF"
        , background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)"
        , borderRadius:"43%"
        , border:'none'
        , justifyContent: 'center'
        , alignItems: 'center'
      };

      const dmFrameStyle = {
        display: 'flex'
        , position: 'fixed' //고정
        , zIndex: '10'
        , bottom: "216px"
        , right: "100px"
        , height: "calc(100% - 116px) !important"
      };

    return (<div>
                <div className="dm-icon-button" style={dmButtonStyle}>
                    <Messenger className="inline" size={30}  style={{width:"35px", height:"35px", background:"linear-gradient(rgb(104, 97, 236) 0%, rgb(127, 97, 236) 100%)", color:"white", border:"none"}}/>
                </div>
                {/* 채팅 컴포넌트 */}
                <div style={dmFrameStyle}>
                    {/* <iframe style={{position:"relative!important", height:"100%!important", width:"100%!important", border:"none!important"}}>
asdasdasdasd
                    </iframe> */}
                    {/* 채팅 리스트 컴포넌트 */}
                    <div className="chat-list" style={{width:'450px', height:'500px', backgroundColor:'white', border : "1px solid lightgray"}}>

                    </div>
                    {/* 채팅방 입장 컴포넌트 */}
                    <div className="chat-into" style={{width:'450px', height:'500px', backgroundColor:'white', border : "1px solid lightgray"}}>
                      {/* 채팅방 제목 영역*/}
                      <div className="chat-into-header" style={{width:'448px', height:'70px', backgroundColor:'white', borderBottom : "1px solid lightgray"}}></div>
                      {/* 채팅방 대화내용 리스트 영역 */}
                      <div className="chat-into-body" style={{width:'448px', height:'358px', backgroundColor:'white', borderBottom : "1px solid lightgray"}}></div>
                      {/* 채팅방 대화 전송 영역 */}
                      <div className="chat-into-footer" style={{width:'448px', height:'70px', backgroundColor:'white', borderBottom : "1px solid lightgray"}}></div>
                    </div>
                </div>
            </div>
    )

}