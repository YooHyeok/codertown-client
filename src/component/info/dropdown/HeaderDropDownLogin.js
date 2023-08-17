import { useContext, createContext, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { HeaderDropDownContext } from "../Header";
import { PersonCircle } from 'react-bootstrap-icons';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import SignUpSimpleModal from './SignUpSimpleModal';

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

  /* const signInterToggle = () => {
    setSignUpShow(!signUpShow)
    setSignUpSimpleShow(!signUpSimpleShow)
    setLoginShow(!loginShow)
  } */
  /* 로그인/회원가입 Context */
  const signUpInContext = {//user와 set함수를 함께 넘긴다.
    loginShow: loginShow 
    , loginToggle: loginToggle.bind(this)
    , signUpShow: signUpShow
    , signUpToggle: signUpToggle.bind(this)
    // , signInterToggle: signInterToggle.bind(this)
    , signUpSimpleShow: signUpSimpleShow
    , signUpSimpleToggle: signUpSimpleToggle.bind(this)
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
    </Dropdown>
  );
}