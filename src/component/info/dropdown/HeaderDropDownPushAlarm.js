import { useContext, useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import { Lightbulb } from 'react-bootstrap-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as  DateUtil from '../../../util/DateUtil.js'

export default function HeaderDropDownPushAlarm() {
  const context = useContext(HeaderDropDownContext);
  const [pushAlarmList , setPushAlarmList] = useState([])
  const [newNotifyCount, setNewNotifyCount] = useState(15);

  const userId = useSelector( (state) => {return state.UserId} );

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("loginEmail", userId);
    axios.post("/my-notification-list", formdata)
    .then((response) => {
      console.log(response.data)
      setPushAlarmList(response.data.notificationDtoList)
      setNewNotifyCount(response.data.newNotifyCount)
    })
    .catch((error)=>{

    })
    
  }, [])

  const pushAlarmListRender = () => {
    return(
            pushAlarmList.map((obj, index) => {
              return (
                <Link key={index} style={{height:'98px !important', textDecoration:'none'}}>
                  {index != 0 && <DropdownItem divider />} {/* 첫번째 인자가 아닌 경우 출력 */}
                <DropdownItem style={{width:'100%', lineHeight: "25px"}}>
                  <div style={{width:'320px', height:'75px'}}>
                        <div style={{width:'50px', height:'75px', float:"left"}}>
                            <img src={`data:image/png;base64,${obj.profileUrl}`} style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%'}}/> 
                        </div>
                        <div style={{width:'260px', minheight:'75px', float:'right'}}>
                            <div style={{width:'180px', minheight:'75px', float:"left"}}>
                              {/* 조건 */}
                              {obj.replyCondition === 'MYPOST' ? <span style={{display:'block', width:'180px', whiteSpace: 'pre-wrap' }}><b>{obj.writerNickname}</b>님이 댓글을 남겼습니다.</span>
                              :obj.replyCondition === 'MYMENTION' ? <span style={{display:'block', width:'180px', whiteSpace: 'pre-wrap' }}><b>{obj.writerNickname}</b>님이 댓글을 남겼습니다.</span>
                              : <span style={{display:'block', width:'180px', whiteSpace: 'pre-wrap' }}><b>{obj.writerNickname}</b>님이 <b>{obj.mentionNickname}</b>님에게 댓글을 남겼습니다.</span>}
                              {/* 내용,제목 */}
                              <div style={{width:'180px'}}>
                                <div><span style={{textOverflow: 'ellipsis'}}>{obj.commentContent}</span></div>
                                <div><span style={{textOverflow: 'ellipsis'}}>{obj.coggleTitle}</span></div>
                              </div>
                            </div>
                            {/* 날짜 */}
                      <div style={{width:'70px', minheight:'75px', heigt:'100%', float:"right"}}>
                            <span>{DateUtil.utcToKrYMD(obj.firstRegDate)}</span>
                      </div>
                      </div>
                      
                  </div>
                </DropdownItem>
              </Link>
              )
            })
          )
  }

  return (
    <Dropdown id="ok" isOpen={context.dropdownOpenPushAlarm} fade="true" toggle={context.togglePushAlarm}>
      <DropdownToggle caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none", height:"79px"}}>{/* 드롭다운 버튼 투명 처리*/}
        <Lightbulb  size={30} style={{color:"black"}}/>
        {newNotifyCount > 0 && 
        <span style={{backgroundColor: '#fa3e3e', borderRadius: '50%', color: 'white', padding: '1px 8px', fontSize: '15px', position: 'absolute', bottom: '42px', left: '25px'}}>
            { newNotifyCount }
        </span>
        }
      </DropdownToggle>
      <DropdownMenu style={{width:"365px", height:"495px"}}>
        {/* 드롭다운 헤더 */}
        <Link>
          <DropdownItem style={{ lineHeight: "25px" }}><b>새 소식</b></DropdownItem>
        </Link>
          <DropdownItem divider />
          {/* 드롭다운 바디 */}
          <div style={{width:"360px", overflow:"auto", height:"380px"}}>
            {pushAlarmListRender()}
          </div>
          <Link>
          <DropdownItem style={{ lineHeight: "25px" }} divider />
          <DropdownItem style={{ lineHeight: "25px", textAlign: 'center' }}><b>더보기 ...</b></DropdownItem>
        </Link>
      </DropdownMenu>
    </Dropdown>
  );
}