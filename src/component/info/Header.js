import { createContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import HeaderDropDownLogin from "./dropdown/HeaderDropDownLogin";
import HeaderDropDownLogout from "./dropdown/HeaderDropDownLogout";
import HeaderDropDownRecruit from "./dropdown/HeaderDropDownRecruit";
import HeaderDropDownCoggle from "./dropdown/HeaderDropDownCoggle";

export const HeaderDropDownContext = createContext();
export default function Header() {
    const style = {
        backgroundColor: 'white',
        borderBottom: "0.5px solid lightgray",
        width: '100%',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000
    }

    const linkStyle = {
        fontSize: "40px"
    }

    const [dropdownOpenLogin, setDropdownOpenLogin] = useState(false);
    const [dropdownOpenLogOut, setDropdownOpenLogOut] = useState(false);
    const [dropdownOpenRecruit, setDropdownOpenRecruit] = useState(false);
    const [dropdownOpenCoggle, setDropdownOpenCoggle] = useState(false);

    const toggleLogin = () => {
        setDropdownOpenLogin(!dropdownOpenLogin);
    }
    const toggleLogOut = () => {
        setDropdownOpenLogOut(!dropdownOpenLogOut);
    }
    const toggleRecruit = () => {
        setDropdownOpenRecruit(!dropdownOpenRecruit);
    }
    const toggleCoggle = () => {
        setDropdownOpenCoggle(!dropdownOpenCoggle);
    }

    const contextValue = {
        dropdownOpenLogin: dropdownOpenLogin,
        dropdownOpenLogOut: dropdownOpenLogOut,
        dropdownOpenRecruit: dropdownOpenRecruit,
        dropdownOpenCoggle: dropdownOpenCoggle,
        toggleLogin: toggleLogin.bind(this),
        toggleLogOut: toggleLogOut.bind(this),
        toggleRecruit: toggleRecruit.bind(this),
        toggleCoggle: toggleCoggle.bind(this)
    }

    const token = useSelector( state=> state.Authorization );
    const userId = useSelector( (state) => {return state.UserId} );
    
    const dietLogin = () => {
        console.log("로그인 정보", token , userId)
        /* if(token == '' || userId == '') {
            alert('로그인이 필요한 페이지입니다. \n 로그인 페이지로 이동합니다.');
            document.location.href = '/login';
            return;
        }
        if(token != '' && userId != '') {
            document.location.href ='/dietScheduler';
            return;
        } */
    }

    return (
            <div style={style}>
                <ul className="nav-items-1">
                    <li className="nav-item">
                        {/* 메인 로고 영역 */}
                        <Link style={linkStyle} to={'/'} id="logo" className="logo-link">
                            <div className="logo-container">
                                <img className="inline logo-image" src={require('./elephant-header.png')} alt='' />
                                <div style={linkStyle} className="logo-text"><b>C</b>oder<b>Town</b></div>
                            </div>
                        </Link>
                    </li>
                    </ul>
                <ul className="nav-items2">
                    <li className="nav-item">
                        {/* Recruit 드롭다운 */}
                        <HeaderDropDownContext.Provider value={contextValue}>
                            <HeaderDropDownRecruit/>
                        </HeaderDropDownContext.Provider>
                    </li>
                    <li className="nav-item">
                        {/* 코글 드롭다운 */}
                        <HeaderDropDownContext.Provider value={contextValue}>
                            <HeaderDropDownCoggle/>
                        </HeaderDropDownContext.Provider>
                    </li>
                </ul>
                <ul className="nav-items3">
                    {/* 로그인 드롭다운 */}
                    <HeaderDropDownContext.Provider value={contextValue}>
                        <li className="nav-item-dropdown">
                            {token == '' && <HeaderDropDownLogin/>}
                            {userId != '' && <HeaderDropDownLogout />}
                        </li>
                    </HeaderDropDownContext.Provider>
                </ul>
            </div>
    )
}

