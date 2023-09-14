import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Table } from 'reactstrap';
import { Button, FormGroup, InputGroup, Input } from 'reactstrap';
import { Search } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

import axios from "axios";

export default function Mammoth() {
    const divStyle = {
        width: '1200px'
        , height: '750px'
        , textAlign: 'left'
        , margin: '100px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };

      const userId = useSelector( (state) => {return state.UserId} );


    const [mammothList , setMammothList] = useState([])
    const [articleCount , setArticleCount] = useState('') // 게시글 갯수
    const [pageInfo, setPageInfo] = useState({
        allPage: 10, curPage: 1, startPage: 1, endPage: 10
      });

    const [keyword , setKeyword] = useState('')

    const inputChange = (e) => {
        setKeyword(e.target.value);
    }
    const pageRequest = (e) => {
    serverRequest(e.target.value, keyword);
    }

    /**
     * 코끼리 목록 출력 - 호스트 서버 통신 메소드
     * @param {} page : 선택된 페이지 정보 파라미터
     */
    const serverRequest = (page) => {
        axios.get(`/recruit?page=${page}&dType=Mammoth&keyword=${keyword}`)
        .then((response)=> {
            setArticleCount(response.data.articleCount)
            setMammothList(response.data.recruitList)
            setPageInfo(response.data.pageInfo)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    /**
     * useEffect - 페이지 진입시 리랜더링
     * serverRequest()를 호출하여 호스트 서버와 통신한다.
     */
    useEffect(() => {
        serverRequest(1, keyword)
      }, [])
    

    return <div style={divStyle}>
                <div style={{margin:"0 auto", width:"180px", display:"flex"}}>
                    <h1 style={{ width:"30px", margin:"30px 0px 30px 0px"}}><b>맘</b></h1>
                    <span style ={{display:"flex", width:"60px", paddingTop: "50px"}}>맞는 사람</span>
                    <h1 style={{width:"30px", margin:"30px -5px 30px 0px"}}><b>모</b></h1>
                    <span style ={{display:"flex", width:"30px", paddingTop: "50px"}}>여서</span>
                    <h1 style={{width:"30px", margin:"30px -5px 30px 0px"}}><b>스</b></h1>
                    <span style ={{display:"flex", width:"35px", paddingTop: "50px"}}>터디</span>
                </div>
                <div style={{display:"flex", margin:'0 auto'}}>
                    <div style={{width:"290px", display:"flex"}}>
                        {/* <h1 style={{ width:"30px", margin:"30px 0px 30px 0px"}}><b>맘</b></h1>
                        <span style ={{display:"flex", width:"60px", paddingTop: "50px"}}>맞는 사람</span>
                        <h1 style={{width:"30px", margin:"30px -5px 30px 0px"}}><b>모</b></h1>
                        <span style ={{display:"flex", width:"30px", paddingTop: "50px"}}>여서</span>
                        <h1 style={{width:"30px", margin:"30px -5px 30px 0px"}}><b>스</b></h1>
                        <span style ={{display:"flex", width:"35px", paddingTop: "50px"}}>터디</span> */}
                        <span style ={{display:"flex", width:"65px", paddingTop: "50px", color:'gray'}}>{articleCount}개</span>


                    </div>
                    <div style={{width:"9850px"}}>
                        <FormGroup style={{float:"right", paddingTop: "40px"}}>
                            <InputGroup size="s">
                            <Input type="text" value={keyword} onChange={inputChange} placeholder='검색어를 입력하세요' style={{boxShadow: 'none', width:"200px", display: "inline-block"}} />
                                <Button outline className="d-flex align-items-center" onClick={(e)=>{serverRequest(1, keyword);}} color="secondary" style={{width:"38px", border:"0.1px solid lightgray"}}>
                                    <Search className="ml-auto" style={{margin: '0 -3px 0 -2px', fontSize: '1.5rem' }}/>
                                </Button>
                            </InputGroup>
                        </FormGroup>
                    </div>
                </div>
                <div style={{borderTop: '0.1px solid lightgray', height:"420px"}}>
                    <Table >
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일자</th>
                                <th>
                                    인기📜
                                </th>
                                <th>
                                    조회👀
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{overflow:"auto"}}>
                            {/* {this.repeatTrTd()} */}
                            {mammothList.map((obj) => {
                                return (
                                    <tr key={obj.recruitDto.recruitNo}>
                                    <td>{obj.recruitDto.recruitNo}</td>
                                    <td><Link to={`/mammoth-detail/${obj.recruitDto.recruitNo}`}>{obj.recruitDto.title}</Link></td>
                                    <td>{obj.recruitDto.writer.nickname}</td>
                                    <td>{new Date(obj.recruitDto.firstRegDate).toISOString().split('T')[0]}</td>
                                    <td>{obj.recruitDto.likedCount}</td>
                                    <td>{obj.recruitDto.views}</td>
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
                        if(userId == '') {
                            alert('글을 작성하기 위해서는 로그인을 해주세요.');
                            return;
                        }
                        document.location.href="/mammoth-write";
                    }}>글쓰기</Button>
                    </div>
                    <div style={{ clear:"both", textAlign:"center"}}>
                        {(() => {
                            const array = [];
                            if(articleCount == 0) {
                                array.push(
                                <span key={1}><Button style={{border:"none"}} color='secondary' className='numberbutton' value={1} onClick={(e)=>{
                                e.preventDefault();
                                }
                                }>1</Button>&nbsp;&nbsp;</span>
                            )
                            return array;
                            }
                            for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
                                if (i == pageInfo.curPage) {
                                array.push(
                                    <span key={i}><Button style={{border:"none"}} color='secondary' className='numberbutton' value={i} onClick={(e)=>{
                                        if(pageInfo.curPage === i) return;
                                        pageRequest(e)}}>{i}</Button>&nbsp;&nbsp;</span>
                                )
                                } else {
                                array.push(
                                    <span key={i}><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={i} onClick={pageRequest}>{i}</Button>&nbsp;&nbsp;</span>
                                )
                                }
                            }
                            if(articleCount != 0)
                            array.unshift(
                                <span key={"prev"}><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage-1} onClick={(e)=>{
                                    if(pageInfo.curPage === 1) return;
                                    pageRequest(e)}}>{"<"}</Button>&nbsp;&nbsp;</span>
                            )
                            if(articleCount != 0)
                            array.push(
                                <span key={"next"}><Button style={{border:"none"}} outline color='secondary' className='numberbutton' value={pageInfo.curPage+1} onClick={(e)=>{
                                    if(pageInfo.curPage === Math.max(pageInfo.allPage)) return;
                                    pageRequest(e)}}>{">"}</Button>&nbsp;&nbsp;</span>
                            )
                            return array;
                            })()}
                    </div>
                </div>
}