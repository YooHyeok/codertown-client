
import {
    Button, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
  } from 'reactstrap';

import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function MammothCardList() {

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
        <div style={{width: "1225px", display: "grid", gridTemplateRows: "repeat(2, 1fr)", gridTemplateColumns: "repeat(4, 1fr)"}}>
            {cokkiriCardList.slice(0, 20).map((c, i) => ( /* slice를 통해 20개만 출력 */
            <Link> {/* Mammoth인지 Cokkiri글인지 증명후 url생성 */}
                <Card key={c.rno} style={{width: '250px', fontSize: '1.125rem', cursor: 'pointer', padding: '0.5rem', margin: '1rem', borderRadius:'8%', boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
                    <CardBody className="card-body">
                    <CardSubtitle className="mb-2 text-muted" tag="h6" >
                        <Button size='sm' color="warning">맘모스 배너위치</Button>
                    </CardSubtitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6" >목표 기간 | XX주 </CardSubtitle>
                    <CardTitle className="mb-2 text-muted">맘모스 글 제목입니다.</CardTitle>
                    <CardText className="mb-2 text-muted"tag="h6">작성자: 유혁스쿨</CardText>
                    <Button outline size='sm' style={{float:'right'}}>참여정보</Button>
                </CardBody>
                </Card>
            </Link>
            ))}
        </div>
    )
}
