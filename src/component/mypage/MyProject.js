import { useState, useEffect, useRef } from "react";
import {  Button, Table } from 'reactstrap';

export default function MyProject() {

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
    {console.log("프로젝트 호출됨")}
        <Table style={{borderTop: '0.1px solid lightgray', margin:"40px auto"}}>
            <thead>
                <tr>
                    <th>No</th>
                    <th>프로젝트</th>
                    <th>파트</th>
                    <th>시작일</th>
                    <th>종료(예정)</th>
                    <th>전체 상태</th>
                    <th>개인 상태</th>
                    <th>파트 정보</th>
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
                        <td>{obj.title}</td>
                        <td>{obj.writer}</td>
                        <td>{obj.firstRegDate}</td>
                        <td>{obj.firstRegDate}</td>
                        <td>
                        <select ref={selectRef} name="" id="statusSelect" value={{}} onChange={(e)=>{e.preventDefault();}}
                            style={{display:"inline", width:"50px", paddingRight:"-20px", lineHeight:"normal", height:"20px", fontSize:"15px", border:"none", outline:"none"}}>
                            <option value={"RECRUIT"}>모집</option>
                            <option value={"RUN"}>진행</option>
                            <option value={"FAIL"}>무산</option>
                            <option value={"CLOSED"}>완료</option>
                        </select>
                        </td>
                        <td>{obj.count}</td>
                        <td>
                            <Button color='secondary' style={{ width: '70px', padding:"0.5em", height:"20px" }} onClick={(e)=>{e.preventDefault();}}>
                                <span style={{position:"relative", height:"20px", top:"-10px", fontSize:"15px"}}>정보 보기</span>
                            </Button>
                        </td>
                    </tr>
                    )
                })}
            </tbody>
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