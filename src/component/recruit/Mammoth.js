
// import axios from "axios";
import { useState, useEffect } from "react";
import { Table } from 'reactstrap';
import { BsFillSuitHeartFill } from "react-icons/bs"
import { Button, FormGroup, InputGroup, Input } from 'reactstrap';
import { Search } from 'react-bootstrap-icons';

export default function Mammoth() {
    const divStyle = {
        width: '1200px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '750px'
        , textAlign: 'left'
        , margin: '100px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };

    const [coggleList , setCoggleList] = useState([])
    const [pageInfo, setPageInfo] = useState({
        allPage: 10, curPage: 1, startPage: 1, endPage: 10
      });

    const pageRequest = (e) => {
    console.log("e.target.value : " + e.target.value);
    }
    useEffect(() => {
        /* coggleList 목데이터 */
        const mockCoggleList = [];
        for (let j = 0; j < 10; j++) {
            mockCoggleList.push({coggleNo:j, title: '제목'+j, writer: '작성자'+j, firstRegDate:"2023-08-14", like: j, count: j});
        }
        setCoggleList(mockCoggleList)
      }, [])
    

    return <div style={divStyle}>
                <div>
                    <h1 style={{ textAlign:"center"}}><b>Recruit</b></h1>
                </div>
                <div style={{display:"flex"}}>
                    <div>
                        <h1 style={{margin:"30px 15px 30px 0px", width:"85px"}}><b>맘모스</b></h1>
                    </div>
                    <div style={{width:"140px", height:"32px", paddingTop: "45px"}}>
                        <span style ={{display:"flex", width:"140px"}}>맘맞는사람 모여서 스터디</span>
                        {/* <select name="" id="mealSelect" value={{}} onChange={(e)=>{}}
                            style={{display:"inline", width:"120px", height:"30px", fontSize:"15px", padding:"0px 20px 0px 12px"}}>
                            <option value={"Cokkiri"} >코끼리</option>
                            <option value={"Mammoth"} >맘모스</option>
                        </select> */}
                    </div>
                    <div style={{width:"900px"}}>
                        <FormGroup style={{float:"right", paddingTop: "40px"}}>
                            <InputGroup size="s">
                                <Input type="text" onKeyDown={(e)=>{}} onChange={{}} placeholder='검색어를 입력하세요' style={{boxShadow: 'none', width:"200px", display: "inline-block"}} />
                                <Button outline className="d-flex align-items-center" onClick={(e)=>{}} color="secondary" style={{width:"38px", border:"0.1px solid lightgray"}}>
                                    <Search className="ml-auto" style={{margin: '0 -3px 0 -2px', fontSize: '1.5rem' }}/>
                                </Button>
                            </InputGroup>
                        </FormGroup>
                    </div>
                </div>
                <div style={{borderTop: '0.1px solid lightgray'}}>
                    <Table >
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일자</th>
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
                                    <td>{obj.title}</td>
                                    <td>{obj.writer}</td>
                                    <td>{obj.firstRegDate}</td>
                                    <td>{obj.like}</td>
                                    <td>{obj.count}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                        {/* map은 각각의 요소마다 return한다. */}
                        
                    </Table>
                </div>
                    <div style={{float:"right"}} >
                        <Button color='secondary'onClick={(e)=>{
                        e.preventDefault();
                        document.location.href="/mammoth-write";
                    }}>글쓰기</Button>
                    </div>
                    <div style={{ clear:"both", textAlign:"center"}}>
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
                </div>
}