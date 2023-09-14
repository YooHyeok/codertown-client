import axios from "axios";
import MammothCard from './MammothCard';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

export default function MammothCardList() {

    const [mammothCardList , setMammothCardList] = useState([]);
    const [keyword , setKeyword] = useState('')
    const userId = useSelector((state) => { return state.UserId });

    /**
     * 코끼리 목록 출력 - 호스트 서버 통신 메소드
     * @param {} page : 선택된 페이지 정보 파라미터
     */
    const serverRequest = (page, keyword) => {
        axios.get(`/recruit?page=${page}&size=${20}&dType=Mammoth&keyword=${keyword}&loginId=${userId}`)
        .then((response)=> {
            setMammothCardList(response.data.recruitList)
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    useEffect(() => {
      serverRequest(1, keyword)
    }, [])

    return(
        <div style={{width: "1200px", display: "grid", gridTemplateRows: "repeat(2, 1fr)", gridTemplateColumns: "repeat(4, 1fr)"}}>
            {mammothCardList != undefined && mammothCardList.slice(0, 20).map((obj, i) => ( /* slice를 통해 20개만 출력 */
                <MammothCard  key={obj.recruitDto.recruitNo} obj={obj}/>
            ))}
        </div>
    )
}
