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
            <ul className="footer-items-0" >
            </ul>
            <ul className="footer-items-1" >
                <li tyle={{paddingTop:"20px"}} className="footer-item inline ">
                    {/* <Link to={'/'} id="logo"><img className='inline w-32' src={require('../../resources/img/logo/cookcrew.png')} alt=''/></Link> */}
                    {/* <Link to={'/'}><img style={{width:"240px"}} src={require('../../resources/img/logo/cookcrew3.png')} alt='' /></Link> */}
                    <span>Copyright© By 2023. CookCrew All Rights Reserved.</span>
                </li>
            </ul>
            <ul className="footer-items-2" >
                <li className="footer-item" style={{paddingTop:"40px"}}>
                    {/* <h5>프로젝트 참여 </h5><br/>
                    <span>
                        <a style={{width:"20px"}} className="inline-block social-icon" href="https://github.com/YooHyeok" target="_blank">
                            <SiGithub className="inline"/> 
                        </a>
                        유재혁 : webdevyoo@gmail.com</span><br/>
                    <span>
                        <a style={{width:"20px"}} className="inline-block social-icon" href="https://github.com/mdmdr8" target="_blank">
                            <SiGithub className="inline"/> 
                        </a>
                        박지혜 : krystle.pk@gmail.com</span><br/>
                    <span>
                        <a style={{width:"20px"}} className="inline-block social-icon" href="https://github.com/JoHB94" target="_blank">
                            <SiGithub className="inline"/> 
                        </a>
                        조현빈 : webdp1503@gmail.com</span><br/>
                    <span>
                        <a style={{width:"20px"}} className="inline-block social-icon" href="https://github.com/92Lee92" target="_blank">
                            <SiGithub className="inline"/> 
                        </a>
                        이규희 : devindeed92@gmail.com</span><br/> */}
                </li>
            </ul>
        </div>
    )
}