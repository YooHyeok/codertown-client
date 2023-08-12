import { useContext } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { HeaderDropDownContext } from "../Header";
import { PersonCircle } from 'react-bootstrap-icons';

export default function HeaderDropDownCoggle() {

  const context = useContext(HeaderDropDownContext);

  return (
    <Dropdown id="ok" isOpen={context.dropdownOpenCoggle} fade="true" toggle={context.toggleCoggle}>
      <DropdownToggle caret style={{ backgroundColor: "rgba(0,0,0,0)", border: "none" }}>{/* 드롭다운 버튼 투명 처리*/}
        <span style={{color:"black", fontSize:"24px"}}>Coggle</span>
      </DropdownToggle>
      <DropdownMenu >
        <Link to={'/'}><DropdownItem style={{ lineHeight: "25px" }}><b>TechQue</b></DropdownItem></Link>
        <Link to={'/'}><DropdownItem style={{ lineHeight: "25px" }}><b>Carrier</b></DropdownItem></Link>
        <Link to={'/'}><DropdownItem style={{ lineHeight: "25px" }}><b>DevLife</b></DropdownItem></Link>
      </DropdownMenu>
    </Dropdown>
  );
}