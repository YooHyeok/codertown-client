import { Link } from 'react-router-dom';
import {SiGithub} from "react-icons/si"
export default function Footer() {
    const style = {
        height:"240px",
        marginTop:"auto",
        borderTop: "0.5px solid lightgray",
        backgroundColor:"white",
        textAlign : "left"
    }
    return(
        <div style={style} >
            <div className="footer-items-0" />
            <p style={{fontSize:"40px"}} className="logo-text"><b>C</b>oder<b>Town</b></p>
            <p></p>
            <span>채팅 커뮤니티 플랫폼 <br/>코딩하는 사람 끼리 | 맘 맞는 사람 모여 스터디</span> <br/>Copyright© By 2023. CoderTown All Rights Reserved.
            <ul style={{display:"flex", alignItems: "center", listStyle:"none", justifyContent:"flex-start", margin:"10px 0 8px -5px"}}>
                <li style={{padding:"0 5px 0 0"}}>
                    이용약관
                </li>
                <li style={{padding:"0 5px 0 0"}}>
                    개인정보 처리 방침
                </li>
                <li style={{padding:"0 5px 0 0"}}>
                    FAQ
                </li>
            </ul>
            <span>경기 광명시 오리로 835 해보자컴퍼니 유재혁 <br/>webdevyoo@gmail.com</span>
        </div>
    )
}