import { useContext, createContext, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import { PersonCircle } from 'react-bootstrap-icons';
import LoginModal from './LoginModal';

export const HeaderLoginContext = createContext();
export default function HeaderDropDownLogin() {


  const context = useContext(HeaderDropDownContext);

  /* 로그인 모달 */
  const [loginShow, setLoginShow] = useState(false);
  const loginToggle = () => {
    setLoginShow(!loginShow)
  }
  /* 로그인 모달  context */
  const loginModal = {//user와 set함수를 함께 넘긴다.
    loginShow: loginShow
    , loginToggle: loginToggle.bind(this)
  }

  return (
    <Dropdown id="ok" isOpen={context.dropdownOpenLogin} fade="true" toggle={context.toggleLogin}>
      <DropdownToggle caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}>
        <PersonCircle className="inline" size={30}  style={{color:"black"}}/>
      </DropdownToggle>
      <DropdownMenu >

        {/* <Link to={'/login'}><DropdownItem style={{ lineHeight: "25px" }}><b>로그인</b></DropdownItem></Link> */}
        <DropdownItem style={{ lineHeight: "25px" }} onClick={(e)=>{e.preventDefault(); loginToggle();}}><b>로그인</b></DropdownItem>
        <DropdownItem style={{ lineHeight: "25px" }} divider />
        <Link to={'/join'}><DropdownItem style={{ lineHeight: "25px" }}><b>회원가입</b></DropdownItem></Link>

      </DropdownMenu>
      {loginShow && 
        <HeaderLoginContext.Provider value={loginModal}>
        <LoginModal />
      </HeaderLoginContext.Provider>
      }
    </Dropdown>
  );
}