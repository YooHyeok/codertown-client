import { useState, useEffect, useContext } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import axios from "axios";
import {reqToken} from "../../../redux_jwt/RequestToken";
import {useCookies} from "react-cookie";
import { useDispatch, useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
export default function HeaderDropDownLogout() {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useSelector(state => state.Authorization);
  const userId = useSelector( (state) => {return state.UserId} );
  // const [src, setSrc] = useState('/default_profile.png');
  const [src, setSrc] = useState(`/profileImage/${userId}`);
  /**
   * 로컬 스토리지에 링크를 통해 접속했을 경우 1값으로 초기화시킨다.
   */
    const storageTabSet = () => {
      localStorage.setItem('activeTab', '1');
    };

  const context = useContext(HeaderDropDownContext);
  const dispatch = useDispatch();
  
  const [cookie, setCookie] = useCookies(["refreshToken"]);

  useEffect(() => {
    if(accessToken != '') {
      reqUser();
    }
  }, [accessToken]);

  const reqUser = async () => {
      try {
          const response = await axios.post('/token-valid-check', null, 
          {
              headers: {"X-AUTH-TOKEN": accessToken}
          });
          if (response.status === 200) { // 토큰이 유효
            if(response.data.validcode === 200) { // 토큰이 유효하다면 프로필사진 출력
              axios.get(`/profileImage/${userId}`)
              .then((response)=>{
                  if (response.data == '') setSrc('/default_profile.png')
                  else setSrc(`/profileImage/${userId}`);
              })
              return;
            }
          }
      } catch (error) {
          if (error.request.status === 401) { //401 UnAuthorized (인증 만료)
              const rescode = error.response.data.rescode;
              if (rescode == 100) { // accesstoken 만료
                  reqToken(accessToken, dispatch, cookie, setCookie);
              }
          }
      }

  }

  const submit = (e) => {
    logout(logoutDispatch);
  }

  const logoutDispatch = () => {
    dispatch({ type: "NEWTOKEN", data: '' });
    dispatch({ type: "USERID", data: '' });
  } 


  const logout = async (logoutDispatch) => {
    try {
      await logoutDispatch();
    } catch (error) {
      // 에러 처리
      console.error("에러 발생:", error);
    }
    //로그아웃 성공 후 메인페이지로 이동
    let redirectUrl = location.pathname == '/mypage' ?  '/' : location.pathname;
    navigate(redirectUrl, true);
  };

  return (
    <Dropdown isOpen={context.dropdownOpenLogOut} fade="true" toggle={context.toggleLogOut}>
      <DropdownToggle caret style={{ backgroundColor: "rgb(0,0,0,0)", border: "none" }}>
        <img style={{width:'35px', height:'35px'}} className="profile" src={src} alt="profile"/>
      </DropdownToggle>
      <DropdownMenu>
        <Link to={'/mypage'} onClick={storageTabSet}><DropdownItem style={{ lineHeight: "25px" }} ><b>마이페이지</b></DropdownItem></Link>
        <DropdownItem style={{ lineHeight: "25px" }} divider />
        {/* <Link onClick={logout}><DropdownItem style={{ lineHeight: "25px" }} ><b>로그아웃</b></DropdownItem></Link> */}
        <DropdownItem onClick={submit} style={{ lineHeight: "25px" }} ><b>로그아웃</b></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}