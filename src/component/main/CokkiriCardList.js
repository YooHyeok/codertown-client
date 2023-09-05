
import {
    Button, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
  } from 'reactstrap';

import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function CokkiriCardList() {

    const [cokkiriCardList , setCokkiriCardList] = useState([]);
    useEffect(() => {
      /* coggleList 목데이터 */
      const cokkiriList = [];
      for (let j = 0; j < 30; j++) {
        cokkiriList.push({coggleNo:j, title: '제목'+j, writer: '작성자'+j, firstRegDate:"2023-08-14", like: j, count: j});
      }
      setCokkiriCardList(cokkiriList)
    }, [])

    return(
        <div style={{width: "1200px", display: "grid", gridTemplateRows: "repeat(2, 1fr)", gridTemplateColumns: "repeat(4, 1fr)"}}>
            {cokkiriCardList.slice(0, 20).map((c, i) => ( /* slice를 통해 20개만 출력 */
            <Link style={{textDecoration:'none'}}> {/* Mammoth인지 Cokkiri글인지 증명후 url생성 */}
                <Card key={c.rno} style={{width: '280px', height:'300px',fontSize: '1.125rem', cursor: 'pointer', padding: '0.5rem', margin: '0.5rem', marginBottom:'0.8rem', borderRadius:'8%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)"}}>
                    <CardBody className="card-body">
                        <CardSubtitle className="mb-3 text-muted" tag="h6" >
                            <div class="studyItem_badgeWrapper__3AW7k">
                                <div class="badge_badge__ZfNyB">
                                    <div class="badge_study__39LDm">🗂 코끼리</div>
                                </div>
                            </div>
                        </CardSubtitle>
                        <CardTitle className="mb-3 text-muted css-a6vgi6" ><b>채팅 서비스 프로젝트에 합류하실 프론트엔드 혹은 RN 개발자 모집합니다!</b></CardTitle>
                        <div class="studyItem_schedule__3oAnA"><p class="studyItem_scheduleTitle__1KN_9">목표기간 |</p><p>16주</p></div>
                            <ul class="main_project_part_list_ul" style={{width:'240px', listStyle: 'none', margin:'0px', padding: '0'}}>
                                <li class="main_project_part_list_li">PM</li>
                                <li class="main_project_part_list_li">디자이너</li>
                                <li class="main_project_part_list_li">퍼블리셔</li>
                                <li class="main_project_part_list_li">백엔드</li>
                                <li class="main_project_part_list_li">프론트앤드</li>
                            </ul>
                        {/* <Button outline size='sm' style={{float:'right'}}>참여정보</Button> */}
                    </CardBody>

                    <div style={{width:'250px', display:'flex', padding:'5px 16px', borderTop:'1px solid lightgray'}}>
                        <div style={{width:'120px'}}>
                            <img style={{float:'left', width:'30px', height:'30px', borderRadius:'50%'}}  src={'/default_profile3.png'} alt="profile"/>

                           <span>webdevyoo</span>
                        </div>
                        <div style={{width:'120px'}}>
                            <div style={{width:'50px', display:'flex', float:'right'}}>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" color="#999999" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style={{color: "rgb(153, 153, 153)"}}>
                                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                                </svg>
                                <p className="text-muted">56</p>
                            </div>
                        </div>
                     </div>
                     {/* <section className="studyItem_info__OFIQU">
                            <div className="avatar_user__1Pgut">
                            </div>
                            <div style={{float:'left',}}>webdevyoo</div>
                        <div style={{float:'right'}}>
                            <div className="studyItem_infoItem__3vxSf">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" color="#999999" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style={{color: "rgb(153, 153, 153)"}}>
                                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                                </svg>
                                <p>56</p>
                            </div>
                        </div>
                    </section> */}
                </Card>
            </Link>
            ))}
        </div>
    )
}
