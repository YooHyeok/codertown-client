import { useContext, useState, useEffect, useRef } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import { Lightbulb } from 'react-bootstrap-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as  DateUtil from '../../../util/DateUtil.js'
import { useInView } from 'react-intersection-observer';

export default function HeaderDropDownPushAlarm() {
  const context = useContext(HeaderDropDownContext);
  const [pushAlarmList , setPushAlarmList] = useState([])
  const [newNotifyCount, setNewNotifyCount] = useState(0);

  const userId = useSelector( (state) => {return state.UserId} );
  const navigate = useNavigate();

  useEffect(() => {
    setInterval(() => {
      const formdata = new FormData();
      formdata.append("loginEmail", userId);
      axios.post("/init-new-notify-count", formdata)
        .then((response) => {
          setNewNotifyCount(0)
        })
        .catch((error)=>{
        })
    },300000) //5분 주기
  }, [])

  useEffect(() => {
    if(context.dropdownOpenPushAlarm === true && page){
      pushAlarmListSearch(true, 1);
    }
  }, [context.dropdownOpenPushAlarm])
  
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  
  useEffect(() => {
    if (inView && page > 1) {
    pushAlarmListSearch(false, page);
    }
  }, [inView])


  const pushAlarmListSearch = (init, page) => {
    const formdata = new FormData();
    formdata.append("loginEmail", userId);
    formdata.append("page", page);
    formdata.append("size", 20);
    axios.post("/my-notification-list", formdata)
    .then((response) => {
      setPage(page+1);
      setNewNotifyCount(response.data.newNotifyCount);
      if(init) {
        setPushAlarmList(response.data.notificationDtoList)
        return;
      }
      setPushAlarmList(prevPushAlarmList => [...prevPushAlarmList, ...response.data.notificationDtoList]); //기존 state배열을 복사한 후 새로운 데이터를 추가하여 state 상태 업데이트

    })
    .catch((error)=>{
      console.log(error)
    })
  }


  const pushAlarmListRender = () => {
    return(
            pushAlarmList.map((obj, index1) => {
              return (
                <div key={obj.notificationNo}
                onClick={()=>{
                  navigate(`/coggle-detail/${obj.coggleNo}`, { state: { commentNo: obj.commentNo } });
                  const formdata = new FormData();
                  formdata.append("notificationNo", obj.notificationNo);
                  axios.post("/notify-change-clicked", formdata)
                  .then((response)=>{
                    /* pushAlarmList  isClicked true update 로직 */
                    const updatePushAlarmList = pushAlarmList.map((obj, index2) => {
                      /* 자바의 stream Map과 비슷한 원리 */
                      if (index1 === index2) {
                        return { // 해당 object 의 isClicked요소 true로 변경 후 obj 반환
                          ...obj,
                          isClicked: true
                        };
                      }
                      return obj;
                    })
                    setPushAlarmList(updatePushAlarmList)
                  })
                  .catch((error)=>{

                  })
                  
                }}
                 style={{backgroundColor: obj.isClicked ?  'white': '#f5f5f5'}}>
                  {/* index != 0 && <DropdownItem divider /> */} {/* 첫번째 인자가 아닌 경우 출력 */}
                <DropdownItem style={{width:'100%', lineHeight: "25px", borderBottom: index1 != pushAlarmList.length-1 ? "1px solid lightgray" : null}}>
                  <div style={{width:'320px', height:'75px'}}>
                        <div style={{width:'50px', height:'75px', float:"left"}}>
                            <img src={`data:image/png;base64,${obj.profileUrl}`} style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%'}}/> 
                        </div>
                        <div style={{width:'260px', minheight:'75px', float:'right'}}>
                            <div style={{width:'180px', minheight:'75px', float:"left"}}>
                              {obj.replyCondition === 'MYPOST' ? <span style={{display:'block', width:'180px', whiteSpace: 'pre-wrap', color:'#777777'}}><b style={{color:'#ff5544'}}>{obj.writerNickname}</b>님이 댓글을 남겼습니다.</span>
                              :obj.replyCondition === 'MYMENTION' ? <span style={{display:'block', width:'180px', whiteSpace: 'pre-wrap', color:'#777777'}}><b style={{color:'#f54'}}>{obj.writerNickname}</b>님이 댓글을 남겼습니다.</span>
                              : <span style={{display:'block', width:'180px', whiteSpace: 'pre-wrap', color:'#777777' }}><b style={{color:'#f54'}}>{obj.writerNickname}</b>님이 <b style={{color:'#f54'}}>{obj.mentionNickname}</b>님에게 댓글을 남겼습니다.</span>}
                              <div style={{width:'180px'}}>
                                <div><span style={{display:'block', maxWidth:'180px', overflow: 'hidden', textOverflow: 'ellipsis', color:'#777777'}}>{obj.commentContent}</span></div>
                                <div><span style={{display:'block', maxWidth:'180px', overflow: 'hidden', textOverflow: 'ellipsis', color:'#909090'}}>{obj.coggleTitle}</span></div>
                              </div>
                            </div>
                      <div style={{width:'70px', minheight:'75px', heigt:'100%', float:"right"}}>
                            <span style={{color:'#909090'}}>{DateUtil.utcToKrYMD(obj.firstRegDate)}</span>
                      </div>
                      </div>
                  </div>
                </DropdownItem>
              </div>
              )
            })
          )
  }

  return (
    <Dropdown id="ok" isOpen={context.dropdownOpenPushAlarm} fade="true" toggle={context.togglePushAlarm}>
      <DropdownToggle caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none"}}>{/* 드롭다운 버튼 투명 처리*/}
        <Lightbulb  size={30} style={{color:"black"}}/>
      </DropdownToggle>
      {newNotifyCount > 0 && 
        <span style={{lineHeight:'25px',backgroundColor: '#fa3e3e', borderRadius: '50%', color: 'white', padding: '1px 8px', fontSize: '15px', position: 'absolute', bottom: '42px', left: '25px'}}>
            { newNotifyCount }
        </span>
        }
      <DropdownMenu style={{width:"365px", height:"425px", borderRadius:'5px 5px 0 0'}}>
        {/* 드롭다운 헤더 */}
          <DropdownItem style={{ lineHeight: "25px", borderBottom:'1px solid lightgray' }}><b>새 소식</b></DropdownItem>
          {/* 드롭다운 바디 */}
          <div style={{width:"363px", overflow:"auto", height:"380px"}}>
            {pushAlarmListRender()}
            <div ref={ref} /> {/* infinity 교차시점 */}
          </div>
      </DropdownMenu>
    </Dropdown>
  );
}