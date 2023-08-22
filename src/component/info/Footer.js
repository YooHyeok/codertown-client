import { Link } from 'react-router-dom';
import {BsGithub} from "react-icons/bs"
import {BsInstagram} from "react-icons/bs"
import { Button} from 'reactstrap';

export default function Footer() {
    const style = {
        height:"250px",
        margin:'0px auto',
        borderTop: "0.5px solid lightgray",
        backgroundColor:"white",
        textAlign : "left"
    }
    return(
        <div className="footer" style={style} >
            
            <div className="footer-items-0" />
            <div className='footer-items-1'>
                <div style={{display:'inline-block', margin: "0px auto", position:'relative', bottom:'30px'}}>
                    <img src='/elephant-footer.png'style={{width:"100px", height:"100px", margin: "2px auto"}}/>
                </div>
                <div style={{width:'240px', height:'85px', position:'relative', top:'10px', display:'inline-block'}}>
                    <div style={{fontSize:"40px"}} className="logo-text">
                    <b>C</b>oder<b>Town</b>
                    </div>
                    <div style={{fontSize:"15px"}}>
                        <span>코딩하는 사람 끼리 | 맘 맞는 사람 모여 스터디 </span>
                    </div>
                    <span>채팅 커뮤니티 플랫폼</span>
                </div>
                <div>
                    <span>Copyright© By 2023. CoderTown All Rights Reserved.</span>
                </div>
                
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
            <div className="footer-items-2" >
                <div style={{width:'100px', height:'50px', marginTop:"170px"}}>
                    <Button size='sm' color="dark"><BsGithub style={{width:'22px', height:'30px'}}/></Button>
                    &nbsp;&nbsp;
                    <Button size='sm' color="dark"><BsInstagram style={{width:'22px', height:'30px'}}/></Button>
                </div>
            </div>
        </div>
    )
}