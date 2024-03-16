import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, } from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import BookMarkButton from '../button/BookMarkButton.js';
import { useState, useEffect } from "react";
import useToast from '../../hook/useToast.js';
import axios from "axios";

export default function MammothCard({obj}) {

    const userId = useSelector( (state) => {return state.UserId} );
    const {toastAlertWarning, toastAlertSuccess} = useToast();
    const [src, setSrc] = useState('/default_profile.png');
    useEffect(() => {
        if (obj.recruitDto.writer.profileUrl == '' || obj.recruitDto.writer.profileUrl == null) setSrc('/default_profile.png')
        else setSrc(`data:image/png;base64,${obj.recruitDto.writer.profileUrl}`);       
    }, [])

    /* 북마크 토글 */
    const [isBookmarked, setIsBookmarked] = useState(obj.recruitDto.isBookmarked);
    const toggle = (e) => {
        if (userId == '') {
            toastAlertWarning('북마크 기능을 이용하시려면 로그인이 필요합니다.');
            return;}
        const formData = new FormData();
        formData.append('recruitNo', obj.recruitDto.recruitNo);
        formData.append('userId', userId);
    
        axios.post('/recruit-bookmark-toggle', formData)
        .then((response) => {
            toastAlertSuccess(response.data.success ? "북마크에 추가되었습니다." : "북마크 해제 되었습니다.");
            setIsBookmarked(response.data.success)
        })
        .catch((error) => {
        console.log(error);
        })
    }
    return (
        <Card className='card' style={{width: '280px', height:'280px',fontSize: '1.125rem', cursor: 'pointer', padding: '0.5rem', margin: '0.5rem', marginBottom:'0.8rem'
            , borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)"}}>
            <CardBody className="card-body">
                <CardSubtitle className="mb-3 text-muted" tag="h6" >
                    <div className="studyItem_badgeWrapper__3AW7k">
                        <div className="badge_badge__ZfNyB">
                            <div className="badge_study__39LDm">✏️ 맘모스 - 스터디</div>
                        </div>
                    </div>
                    <div onClick={toggle} style={{display: 'block', width: '28px', height: '28px', position: 'absolute', top: '20px', right: '20px'}}>
                            <BookMarkButton isBookmarked={isBookmarked} className='inline' />
                    </div>
                </CardSubtitle>
                <CardTitle className="mb-3 text-muted css-a6vgi6" >
                <Link to={`/mammoth-detail/${obj.recruitDto.recruitNo}`} 
                        style={{textDecoration:'none', color:'#212529BF'}}>
                    <b>{obj.recruitDto.title}</b>
                </Link>
                </CardTitle>
                {/* <CardTitle className="mb-3 text-muted " ><b>외부 링크</b> {'www.naver.com'}</CardTitle> */}

                <div className="studyItem_schedule__3oAnA">
                    <p className="studyItem_scheduleTitle__1KN_9">모임 위치 | {obj.recruitDto.location.fullLocation}</p>
                </div>
                    <ul className="main_project_part_list_ul" style={{width:'240px', listStyle: 'none', margin:'0px', padding: '0'}}>
                        <li className="main_project_part_list_li" style={{color:'coral'}}>{obj.recruitDto.link != '' ? '오픈톡' : 'DM'}</li>
                    </ul>
            </CardBody>

            <div style={{width:'250px', height:'40px', display:'flex', padding:'5px 16px', borderTop:'1px solid lightgray'}}>
                <div style={{width:'150px'}}>
                    <img style={{float:'left', width:'30px', height:'30px', borderRadius:'50%'}}  src={src} alt="profile"/>
                    <p className="text-muted" style={{float:'left', marginLeft:'5px'}}>{obj.recruitDto.writer.nickname}</p>
                    
                </div>
                <div style={{width:'100px'}}>
                    <div style={{width:'50px', display:'flex', float:'right'}}>
                        {/* <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" color="#999999" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style={{color: "rgb(153, 153, 153)"}}>
                            <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                        </svg> */}
                        <p className="text-muted">👀&nbsp;{obj.recruitDto.views}</p>
                    </div>
                </div>
            </div>
                
        </Card>
    )
}