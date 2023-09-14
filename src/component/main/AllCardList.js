import axios from "axios";
import CokkiriCard from './CokkiriCard';
import MammothCard from './MammothCard';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

export default function AllCardList() {

    const [keyword , setKeyword] = useState('')
    const userId = useSelector((state) => { return state.UserId });

    const [allCardList , setAllCardList] = useState([]);
    const serverRequest = (page, keyword) => {
        axios.get(`/recruit?page=${page}&size=${20}&dType=&keyword=${keyword}&loginId=${userId}&url=${'main'}`)
        .then((response)=> {
            setAllCardList(response.data.recruitList)
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    useEffect(() => {
      serverRequest(1, keyword)
    }, [])

    return(
        <div style={{width: "1225px", display: "grid", gridTemplateRows: "repeat(2, 1fr)", gridTemplateColumns: "repeat(4, 1fr)"}}>
            {allCardList != undefined  &&  allCardList.slice(0, 20).map((obj, i) => ( /* slice를 통해 20개만 출력 */
                obj.recruitDto.category == 'cokkiri' ? <CokkiriCard key={obj.recruitDto.recruitNo} obj={obj}/> : <MammothCard key={obj.recruitDto.recruitNo} obj={obj}/> 
            ))}
        </div>
    )
}
