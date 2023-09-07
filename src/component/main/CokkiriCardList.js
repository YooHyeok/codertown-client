
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Tooltip, Table } from 'reactstrap';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import CokkiriCard from './CokkiriCard';

export default function CokkiriCardList() {

    const [cokkiriCardList , setCokkiriCardList] = useState([]);
    const [keyword , setKeyword] = useState('')
    const [tooltipOpen, setTooltipOpen] = useState({});
    const toggleTooltip = (recruitNo) => {
        setTooltipOpen({...tooltipOpen, [recruitNo]: !tooltipOpen[recruitNo],});
      };
      
    /**
     * 코끼리 목록 출력 - 호스트 서버 통신 메소드
     * @param {} page : 선택된 페이지 정보 파라미터
     */
    const serverRequest = (page, keyword) => {
        axios.get(`/recruit?page=${page}&size=${20}&dType=Cokkiri&keyword=${keyword}`)
        .then((response)=> {
            setCokkiriCardList(response.data.recruitList)
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    useEffect(() => {
      /* coggleList 목데이터 */
      /* const cokkiriList = [];
      for (let j = 0; j < 30; j++) {
        cokkiriList.push({coggleNo:j, title: '제목'+j, writer: '작성자'+j, firstRegDate:"2023-08-14", like: j, count: j});
      }
      setCokkiriCardList(cokkiriList) */
      serverRequest(1, keyword)
    }, [])

    return(
        <div style={{width: "1200px", display: "grid", gridTemplateRows: "repeat(2, 1fr)", gridTemplateColumns: "repeat(4, 1fr)"}}>
            {console.log(cokkiriCardList)}
            {cokkiriCardList.slice(0, 20).map((obj, i) => ( /* slice를 통해 20개만 출력 */
                <CokkiriCard obj={obj}/>
            ))}
        </div>
    )
}
