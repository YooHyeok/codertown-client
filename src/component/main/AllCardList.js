import axios from "axios";
import CokkiriCard from './CokkiriCard';
import MammothCard from './MammothCard';
import { useState, useEffect } from "react";

export default function AllCardList() {

    const [keyword , setKeyword] = useState('')

    const [allCardList , setAllCardList] = useState([]);
    const serverRequest = (page, keyword) => {
        axios.get(`/recruit?page=${page}&size=${20}&dType=&keyword=${keyword}`)
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
            {allCardList.slice(0, 20).map((obj, i) => ( /* slice를 통해 20개만 출력 */
                obj.recruitDto.category == 'cokkiri' ? <CokkiriCard obj={obj}/> : <MammothCard obj={obj}/> 
            ))}
        </div>
    )
}
