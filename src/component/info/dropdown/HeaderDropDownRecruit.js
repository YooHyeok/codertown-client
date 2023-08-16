import { useContext } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import { PersonCircle } from 'react-bootstrap-icons';

export default function HeaderDropDownRecruit() {

  const context = useContext(HeaderDropDownContext);

  return (
    <Dropdown id="ok" isOpen={context.dropdownOpenRecruit} fade="true" toggle={context.toggleRecruit}>
      <DropdownToggle caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}>{/* 드롭다운 버튼 투명 처리*/}
        <span style={{color:"black", fontSize:"24px"}}>Recruit</span>
      </DropdownToggle>
      <DropdownMenu >
        <Link to={'/cokkiri'}><DropdownItem style={{ lineHeight: "25px" }}><b>Cokkiri</b></DropdownItem></Link>
        <Link to={'/mammoth'}><DropdownItem style={{ lineHeight: "25px" }}><b>Mammoth</b></DropdownItem></Link>
      </DropdownMenu>
    </Dropdown>
  );
}