import { useState, useEffect, useContext } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import axios from "axios";

import { useDispatch, useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

export default function HeaderDropDownLogout() {

  const userId = useSelector( (state) => {return state.UserId} );
  const [src, setSrc] = useState('/default_profile.png');
  useEffect(() => {
      axios.get(`/profileImage/${userId}`)
      .then((response)=>{
          if (response.data == '') setSrc('/default_profile.png')
          else setSrc(`/profileImage/${userId}`);
      })
  }, [])
  /**
   * 로컬 스토리지에 링크를 통해 접속했을 경우 1값으로 초기화시킨다.
   */
    const storageTabSet = () => {
      localStorage.setItem('activeTab', '1');
    };

  const location = useLocation();
  const context = useContext(HeaderDropDownContext);
  const dispatch = useDispatch();

  /* const logout = (e) => { //토큰값, userId 초기화
    e.preventDefault();
    dispatch({ type: "NEWTOKEN", data: '' })
    dispatch({ type: "USERID", data: '' })
    dispatch({ type: "NICKNAME", data: '' })
      document.location.href = '/';
  } */

  const logout = async (e) => {
    e.preventDefault();
    try {
      // 비동기 작업 1: 첫 번째 dispatch 작업
      await dispatch({ type: "NEWTOKEN", data: '' });
      // 비동기 작업 2: 두 번째 dispatch 작업
      await dispatch({ type: "USERID", data: '' });
      // 비동기 작업 3: 세 번째 dispatch 작업
      await dispatch({ type: "NICKNAME", data: '' });
      // 모든 dispatch 작업이 완료된 후에 페이지 리디렉션
      document.location.href = '/';
    } catch (error) {
      // 에러 처리
      console.error("에러 발생:", error);
    }
  };

  return (
    <Dropdown isOpen={context.dropdownOpenLogOut} fade="true" toggle={context.toggleLogOut}>
      <DropdownToggle className="dropdown-toggle"caret style={{ backgroundColor: "rgb(0,0,0,0)", border: "none" }}>
        <img style={{width:'35px', height:'35px'}} className="profile" src={src} alt="profile"/>
      </DropdownToggle>
      <DropdownMenu>
        <Link to={'/mypage'} onClick={storageTabSet}><DropdownItem style={{ lineHeight: "25px" }} ><b>마이페이지</b></DropdownItem></Link>
        <DropdownItem style={{ lineHeight: "25px" }} divider />
        <Link onClick={logout}><DropdownItem style={{ lineHeight: "25px" }} ><b>로그아웃</b></DropdownItem></Link>
      </DropdownMenu>
    </Dropdown>
  );
}