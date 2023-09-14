import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Tooltip, Table } from 'reactstrap';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import BookmarkButton from '../button/BookmarkButton.js';
import axios from "axios";

export default function CokkiriCard({obj}) {
    const [tooltipOpen, setTooltipOpen] = useState({});
    const toggleTooltip = (recruitNo) => {
        setTooltipOpen({...tooltipOpen, [recruitNo]: !tooltipOpen[recruitNo],});
      };

    const userId = useSelector( (state) => {return state.UserId} );

    const [src, setSrc] = useState('/default_profile3.png');
    useEffect(() => {
        axios.get(`/profileImage/${obj.recruitDto.writer.email}`)
        .then((response)=>{
            if (response.data == '') setSrc('/default_profile3.png')
            else setSrc(`/profileImage/${obj.recruitDto.writer.email}`);
    })
    }, [])
    /* 북마크 토글 */
    const [isBookmarked, setIsBookmarked] = useState(obj.recruitDto.isBookmarked);
    const toggle = (e) => {
        if (userId == '') {
            alert('북마크 기능을 이용하시려면 로그인이 필요합니다.');
            return;}
        const formData = new FormData();
        formData.append('recruitNo', obj.recruitDto.recruitNo);
        formData.append('userId', userId);
    
        axios.post('/recruit-bookmark-toggle', formData)
        .then((response) => {
            alert(response.data.success ? "북마크에 추가되었습니다." : "북마크 해제 되었습니다.");
            setIsBookmarked(response.data.success)
        })
        .catch((error) => {
        console.log(error);
        })
    }

    return (
        <Card  className='card' 
                style={{width: '280px', height:'280px',fontSize: '1.125rem', padding: '0.5rem', margin: '0.5rem', marginBottom:'0.8rem'
                , borderRadius:'2%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)" }}>
                    <CardBody className="card-body">
                        <CardSubtitle className="mb-3 text-muted" tag="h6" >
                            <div className="studyItem_badgeWrapper__3AW7k">
                                <div className="badge_badge__ZfNyB">
                                    <div className="badge_study__39LDm">💻 코끼리 - 프로젝트</div>
                                </div>
                            </div>
                            <div onClick={toggle} style={{display: 'block', width: '28px', height: '28px', position: 'absolute', top: '20px', right: '20px'}}>
                                    <BookmarkButton isBookmarked={isBookmarked} className='inline' />
                            </div>
                        </CardSubtitle>
                        {/* 제목 */}
                        <CardTitle className="mb-2 text-muted css-a6vgi6" >
                            <Link to={`/cokkiri-detail/${obj.recruitDto.recruitNo}`} 
                                    id={"Tooltip" + obj.recruitDto.recruitNo} onMouseEnter={() => toggleTooltip(obj.recruitDto.recruitNo)} onMouseLeave={() => toggleTooltip(obj.recruitDto.recruitNo)}
                                    style={{textDecoration:'none', color:'#212529BF'}}>
                                <b>{obj.recruitDto.title}</b>
                            </Link>
                        </CardTitle>
                        {/* 목표기간 */}
                        <div className="studyItem_schedule__3oAnA">
                            <p className="studyItem_scheduleTitle__1KN_9">목표기간 | {obj.projectDto.objectWeek}주</p>
                        </div>
                        {/* 파트 */}
                        <ul /* id={"Tooltip" + obj.recruitDto.recruitNo} onMouseEnter={() => toggleTooltip(obj.recruitDto.recruitNo)} onMouseLeave={() => toggleTooltip(obj.recruitDto.recruitNo)} */
                          className="main_project_part_list_ul" style={{width:'240px', listStyle: 'none', margin:'0px', padding: '0'}}>
                            {obj.projectDto.projectParts.filter((obj)=>{
                                                return obj.partNo !== 1;
                                            }).map((obj,index) => (
                                <li key={'part_li_' + index + '_' + obj.partNo} className="main_project_part_list_li">{obj.partName}</li>
                            ))}
                        </ul>
                    </CardBody>
                    <div style={{width:'250px', height:'40px', display:'flex', padding:'5px 16px', borderTop:'1px solid lightgray'}}>
                        <div style={{width:'150px'}}>
                            <img style={{float:'left', width:'30px', height:'30px', borderRadius:'50%'}}  src={src} alt="profile"/>
                            <p className="text-muted" style={{float:'left', marginLeft:'5px'}}>{obj.recruitDto.writer.nickname}</p>
                          
                        </div>
                        <div style={{width:'100px'}}>
                            <div style={{width:'50px', display:'flex', float:'right'}}>
                                <p className="text-muted">👀&nbsp;{obj.recruitDto.views}</p>
                            </div>
                        </div>
                     </div>
                     <Tooltip style={{width:"300px"}} placement="bottom" isOpen={tooltipOpen[obj.recruitDto.recruitNo]} target={"Tooltip" + obj.recruitDto.recruitNo}>
                        <Table bordered={true} style={{margin:"5px auto"}} >
                            <thead>
                                <tr>
                                <th>파트 / 현황</th>
                                <th>모집 인원</th>
                                <th>남은 자리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {obj.projectDto.projectParts.filter((obj)=>{
                                                return obj.partNo !== 1;
                                            }).map((obj, index) => {
                                    return(
                                        <tr key={'part_tr_' + index + '_' + obj.partNo}>
                                            <td>{obj.partName}</td>
                                            <td>{obj.recruitCount}</td>
                                            <td>{obj.recruitCount - obj.currentCount}</td>
                                        </tr>
                                    )
                                })}
                            
                            </tbody>
                        </Table>
                    </Tooltip>
                </Card>
    )
}