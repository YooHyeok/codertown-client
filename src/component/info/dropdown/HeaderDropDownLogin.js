import { useContext, createContext, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { HeaderDropDownContext } from "../Header";
import { PersonCircle } from 'react-bootstrap-icons';
import LoginModal from '../modal/LoginModal';
import SignUpModal from '../modal/SignUpModal';
import SignUpSimpleModal from '../modal/SignUpSimpleModal';
import FindUserModal from '../modal/FindUserModal';

export const HeaderLoginContext = createContext();
export const HeaderSignUpContext = createContext();
export default function HeaderDropDownLogin() {


  const context = useContext(HeaderDropDownContext);

  /* 로그인 모달 */
  const [loginShow, setLoginShow] = useState(false);
  const loginToggle = () => {
    setLoginShow(!loginShow)
  }
  /* 회원가입 모달 */
  const [signUpShow, setSignUpShow] = useState(false);
  const signUpToggle = () => {
    setSignUpShow(!signUpShow)
  }
  
  /* 간편 회원가입 모달 */
  const [signUpSimpleShow, setSignUpSimpleShow] = useState(false);
  const signUpSimpleToggle = () => {
    setSignUpSimpleShow(!signUpSimpleShow)
  }

    /* 아이디/패스워드 찾기 모달 */
    const [findUserShow, setFindUserShow] = useState(false);
    const findUserToggle = () => {
      setFindUserShow(!findUserShow)
    }

  /* 로그인/회원가입 Context */
  const signUpInContext = {//user와 set함수를 함께 넘긴다.
    loginShow: loginShow 
    , loginToggle: loginToggle.bind(this)
    , signUpShow: signUpShow
    , signUpToggle: signUpToggle.bind(this)
    , signUpSimpleShow: signUpSimpleShow
    , signUpSimpleToggle: signUpSimpleToggle.bind(this)
    , findUserShow: findUserShow
    , findUserToggle: findUserToggle.bind(this)
  }

  return (
    <Dropdown id="ok" isOpen={context.dropdownOpenLogin} fade="true" toggle={context.toggleLogin}>
      <DropdownToggle className="dropdown-toggle" caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}>
        <PersonCircle size={30}  style={{color:"black"}}/>
      </DropdownToggle>
      <DropdownMenu >

        {/* <Link to={'/login'}><DropdownItem style={{ lineHeight: "25px" }}><b>로그인</b></DropdownItem></Link> */}
        <DropdownItem style={{ lineHeight: "25px" }} onClick={(e)=>{e.preventDefault(); loginToggle();}}><b>로그인</b></DropdownItem>
        <DropdownItem style={{ lineHeight: "25px" }} divider />
        {/* <Link to={'/join'}><DropdownItem style={{ lineHeight: "25px" }}><b>회원가입</b></DropdownItem></Link> */}
        <DropdownItem style={{ lineHeight: "25px" }} onClick={(e)=>{e.preventDefault(); signUpToggle();}}><b>회원가입</b></DropdownItem>

      </DropdownMenu>
      {loginShow && 
        <HeaderLoginContext.Provider value={signUpInContext}>
        <LoginModal />
      </HeaderLoginContext.Provider>
      }
      {signUpShow && 
        <HeaderSignUpContext.Provider value={signUpInContext}>
        <SignUpModal />
      </HeaderSignUpContext.Provider>
      }
      {signUpSimpleShow && 
        <HeaderSignUpContext.Provider value={signUpInContext}>
        <SignUpSimpleModal />
      </HeaderSignUpContext.Provider>
      }
      {findUserShow && 
        <HeaderSignUpContext.Provider value={signUpInContext}>
        <FindUserModal />
      </HeaderSignUpContext.Provider>
      }
    </Dropdown>
  );
}