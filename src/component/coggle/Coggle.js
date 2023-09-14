
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Table } from 'reactstrap';
import { Button, FormGroup, InputGroup, Input } from 'reactstrap';
import { Search } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

import axios from "axios";

export default function Coggle() {
    const divStyle = {
        width: '1200px' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , height: '750px'
        , textAlign: 'left'
        , margin: '100px auto'
        , marginBottom: '50px'
        , padding: '30px'
        , top: '100'
      };

    const userId = useSelector( (state) => {return state.UserId} );

    const [coggleList , setCoggleList] = useState([])
    const [pageInfo, setPageInfo] = useState({
        allPage: 10, curPage: 1, startPage: 1, endPage: 10
      });

    const pageRequest = (e) => {
        serverRequest(e.target.value, keyword);
    }

    const [articleCount , setArticleCount] = useState('') // 게시글 갯수

    const [keyword , setKeyword] = useState(null)
    const inputChange = (e) => {
        setKeyword(e.target.value);
    }


    /* select - onChange 이벤트 종료시점 리랜더링 Flag  */
    const [reRenderFlag, setReRenderFlag] = useState(false);
    const [category , setCategory] = useState('')
    const selectChange = (e) => {
        setCategory(e.target.value);
        reRenderFlag == false ? setReRenderFlag(true) : setReRenderFlag(false)
    }
    
    /**
     * 코글 목록 출력 - 호스트 서버 통신 메소드
     * @param {} page : 선택된 페이지 정보 파라미터
     */
    const serverRequest = (page, category, keyword) => {
        let params = {params: {"page":page, "category": category, "keyword": keyword}}
        axios.get('/coggle', params)
        .then((response)=> {
            setArticleCount(response.data.articleCount)
            setCoggleList(response.data.coggleList)
            setPageInfo(response.data.pageInfo)
        })
        .catch((error) => {
            console.log(error);
        })
    }

      useEffect(() => {
        serverRequest(1, category, keyword)
      }, [reRenderFlag])
    

    return <div style={divStyle}>
                <div style={{margin:"0 auto", width:"185px"}}>
                    <h1 style={{ margin:"30px 0px 30px 0px"}}>
                        <b>코글: {category == "T" ? "기술질문" : 
                                        category == "C" ? "커리어" : 
                                                category == "D" ? "개발일상" : "전체"}</b>
                    </h1>
                </div>
                <div style = {{display:"flex"}}>
                    {/* <div style={{width:"70px"}}>
                        <h1 style={{margin:"30px 20px 30px 0px"}}><b>{''}</b></h1>
                    </div> */}
                    <div style={{width:"170px", height:"32px", paddingTop: "45px"}}>
                        <select name="" id="mealSelect" onChange={selectChange} value={category}
                            style={{display:"inline", width:"120px", height:"30px", fontSize:"15px", padding:"0px 20px 0px 12px"}}>
                            <option value={""} >전체</option>
                            <option value={"T"} >TechQue</option>
                            <option value={"C"} >Carrier</option>
                            <option value={"D"} >DevLife</option>
                        </select>
                    </div>
                    <span style ={{display:"flex", width:"65px", paddingTop: "50px", color:'gray'}}>{articleCount}개</span>
                    <div style={{width:"894px"}}>
                        <FormGroup style={{float:"right", paddingTop: "40px"}}>
                            <InputGroup size="s">
                                <Input type="text" onChange={inputChange} placeholder='검색어를 입력하세요' style={{boxShadow: 'none', width:"200px", display: "inline-block"}} />
                                <Button outline className="d-flex align-items-center" onClick={(e)=>{serverRequest(1, category, keyword);}} color="secondary" style={{width:"38px", border:"0.1px solid lightgray"}}>
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
                                    인기💞
                                </th>
                                <th>
                                    조회👀
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{overflow:"auto"}}>
                            {/* {this.repeatTrTd()} */}
                            {coggleList.map((obj) => {
                                console.log(obj)
                                return (
                                    <tr key={obj.coggleNo}>
                                        <td>{obj.coggleNo}</td>
                                        <td><Link to={`/coggle-detail/${obj.coggleNo}`}>{obj.title}</Link></td>
                                        <td>{obj.writer.nickname}</td>
                                        <td>{new Date(obj.firstRegDate).toISOString().split('T')[0]}</td>
                                        <td>{obj.isLikedMarkedCount}</td>
                                        <td>{obj.views}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                        {/* map은 각각의 요소마다 return한다. */}
                        
                    </Table>
                </div>
                <div style={{float:"right"}} >
                    <Button color='secondary' onClick={(e)=>{
                        e.preventDefault();
                        if(userId == '') {
                            alert('글을 작성하기 위해서는 로그인을 해주세요.');
                            return;
                        }
                        document.location.href="/coggle-write";
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