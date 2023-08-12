import { useContext } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { HeaderDropDownContext } from "./Header";
import { PersonCircle } from 'react-bootstrap-icons';

export default function HeaderDropDownLogin() {

  const context = useContext(HeaderDropDownContext);

  return (
    <Dropdown id="ok" isOpen={context.dropdownOpenLogin} fade="true" toggle={context.toggleLogin}>
      <DropdownToggle caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}>
        <PersonCircle className="inline" size={30}  style={{color:"black"}}/>
      </DropdownToggle>
      <DropdownMenu >

        <Link to={'/login'}><DropdownItem style={{ lineHeight: "25px" }}><b>로그인</b></DropdownItem></Link>
        <DropdownItem style={{ lineHeight: "25px" }} divider />
        <Link to={'/join'}><DropdownItem style={{ lineHeight: "25px" }}><b>회원가입</b></DropdownItem></Link>

      </DropdownMenu>
    </Dropdown>
  );
}