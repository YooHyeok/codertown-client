import { useState, useEffect, useRef } from "react";
import {  Button, Table } from 'reactstrap';
import { BsFillSuitHeartFill } from "react-icons/bs"

export default function MyCoggle() {

    const selectRef = useRef(null);

    const [coggleList , setCoggleList] = useState([])
    const [pageInfo, setPageInfo] = useState({
        allPage: 10, curPage: 1, startPage: 1, endPage: 10
      });

    const pageRequest = (e) => {
    console.log("e.target.value : " + e.target.value);
    }

    /**
     * 컴포넌트 생명주기 Hook
     */
    useEffect(() => {
        /* coggleList 목데이터 */
        const mockCoggleList = [];
        for (let j = 0; j < 10; j++) {
            mockCoggleList.push({coggleNo:j, title: '제목'+j, writer: '작성자'+j, firstRegDate:"2023-08-14", like: j, count: j});
        }
        setCoggleList(mockCoggleList)
      }, [])
    

    /**
     * JSX 시작
     */
    return (
    <>
        <Table style={{borderTop: '0.1px solid lightgray', margin:"40px auto"}}>
            <thead>
                <tr>
                    <th>No</th>
                    <th>카테고리</th>
                    <th>제목</th>
                    <th>작성일자</th>
                    <th>수정일자</th>
                    <th>
                        <BsFillSuitHeartFill style={{width:"20px",height:"20px",margin:"0 auto"}}/>
                    </th>
                    <th>
                        조회수                                            
                    </th>
                </tr>
            </thead>
            {console.log(coggleList)}

            <tbody style={{overflow:"auto"}}>
                {/* {this.repeatTrTd()} */}
                {coggleList.map((obj) => {
                    console.log(obj);
                    return (
                        <tr key={obj.coggleNo}>
                        <td>{obj.coggleNo}</td>
                        <td>{obj.coggleNo}</td>
                        <td>{obj.title}</td>
                        <td>{obj.firstRegDate}</td>
                        <td>{obj.firstRegDate}</td>
                        <td>{obj.like}</td>
                        <td>{obj.count}</td>
                    </tr>
                    )
                })}
            </tbody>
            {/* map은 각각의 요소마다 return한다. */}
            
        </Table>
        <div style={{marginTop:"50px", textAlign:"center"}}>
            {(() => {
                const array = [];
                for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
                    if (i == pageInfo.curPage) {
                    array.push(
                        <span key={i}><Button style={{border:"none"}} color='secondary' className='numberbutton' value={i} onClick={pageRequest}>{i}</Button>&nbsp;&nbsp;</span>
                    )
                    } else {
                    array.push(
                        <span key={i}><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={i} onClick={pageRequest}>{i}</Button>&nbsp;&nbsp;</span>
                    )
                    }
                }
                if(pageInfo.curPage != 1)
                array.unshift(
                    <span ><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage-1} onClick={pageRequest}>{"<"}</Button>&nbsp;&nbsp;</span>

                )
                if(pageInfo.curPage != Math.max(pageInfo.allPage))
                array.push(
                    <span ><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage+1} onClick={pageRequest}>{">"}</Button>&nbsp;&nbsp;</span>

                )
                return array;
                })()}
        </div>
    </>)
}