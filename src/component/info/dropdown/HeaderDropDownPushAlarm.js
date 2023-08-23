import { useContext, useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import { Lightbulb } from 'react-bootstrap-icons';

export default function HeaderDropDownPushAlarm() {
  const context = useContext(HeaderDropDownContext);
  const [pushAlarmList , setPushAlarmList] = useState([])
  useEffect(() => {
    /* coggleList 목데이터 */
    const mockPushAlarmList = [];
    for (let j = 0; j < 12; j++) {
      mockPushAlarmList.push({coggleNo:j, nickname: '작성자'+j, firstRegDate:"2023-08-14", content: '댓글 내용'+j, coggleTitle: '코글 제목'+j});
    }
    setPushAlarmList(mockPushAlarmList)
  }, [])

  const pushAlarmListRender = () => {
    return(
            pushAlarmList.map((obj, index) => {
              return (
                <Link style={{height:'98px !important', textDecoration:'none'}}>
                  {index != 0 && <DropdownItem divider />} {/* 첫번째 인자가 아닌 경우 출력 */}
                <DropdownItem style={{ lineHeight: "25px"}}>
                  <div style={{width:'320px', height:'75px'}}>
                        <div style={{width:'50px', height:'60px', float:"left"}}>
                            <img src='/default_profile2.png' style={{width:'40px', height:'40px', margin:'5px', borderRadius:'50%'}}/> 
                        </div>
                        <div style={{width:'320px', height:'75px'}}>
                            <div style={{width:'320px'}}>
                              <span><b>{obj.nickname}</b>님이 댓글을 남겼습니다.</span> 
                              <span style={{float:'right'}}>{obj.firstRegDate}</span>
                            </div>
                            <div><span >{obj.content}</span></div>
                            <div><span>{obj.coggleTitle}</span></div>
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
      <DropdownToggle caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}>{/* 드롭다운 버튼 투명 처리*/}
        <Lightbulb className="inline" size={30}  style={{color:"black"}}/>
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