import { useState, useEffect, useRef } from "react";
import {  Button, Table, FormGroup, InputGroup, Input, Label} from 'reactstrap';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import { Search } from 'react-bootstrap-icons';
import MyPostRecruit from './MyPostRecruit.js'
import MyPostCoggle from './MyPostCoggle.js'
import axios from "axios";

export default function MyPost(props) {


    const userId = useSelector( (state) => {return state.UserId} );

    const radioRef = useRef(null);

    const [coggleList , setCoggleList] = useState([])
    const [recruitList , setRecruitList] = useState([])
    const [articleCount , setArticleCount] = useState('') // 게시글 갯수
    const [keyword , setKeyword] = useState('')

    const [pageInfo, setPageInfo] = useState({
        allPage: 10, curPage: 1, startPage: 1, endPage: 10
      });

    const inputChange = (e) => {
        setKeyword(e.target.value);
    }
    const pageRequest = (e) => {
        serverRequest(e.target.value, keyword);

    }

    const [option, setOption] = useState('Cokkiri')
    const selectChange = (e) => {
        setOption(e.target.value);
        if(e.target.value == 'Coggle') {
            radioRef.current.style.display ='block';
            return;
        }
        radioRef.current.style.display ='none';
    }

     /**
     * 코끼리 목록 출력 - 호스트 서버 통신 메소드
     * @param {} page : 선택된 페이지 정보 파라미터
     */
     const serverRequest = (page, keyword) => {
        if (option == 'Cokkiri' || option == 'Mammoth') {
            axios.get(`/recruit?page=${page}&dType=${option}&keyword=${keyword}&loginId=${userId}&url=${props.tabType}`)
            .then((response)=> {
                setArticleCount(response.data.articleCount)
                setRecruitList(response.data.recruitList)
                setPageInfo(response.data.pageInfo)
            })
            .catch((error) => {
                console.log(error);
            })
            return;
        }
        
        let params = {params: {"page":page, "category": null, "keyword": keyword, "loginId": userId, "url": props.tabType}}
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

    /**
     * 컴포넌트 생명주기 Hook
     */
    useEffect(() => {
        serverRequest(1, keyword)
      }, [option])
    

    /**
     * JSX 시작
     */
    return (
    <div style={{height:'530px'}}>
        <div style = {{display:"flex", height:"60px"}}>
            <div style={{width:"150px", height:"32px", paddingTop: "15px"}}>
                <select name="" id="mealSelect" onChange={selectChange} value={option}
                    style={{display:"inline", width:"90px", height:"30px", fontSize:"15px", padding:"0px 20px 0px 12px"}}>
                    <option value={"Cokkiri"} >코끼리</option>
                    <option value={"Mammoth"} >맘모스</option>
                    <option value={"Coggle"} >코글</option>
                </select>
            </div>
            <span style ={{display:"flex", width:"65px", paddingTop: "20px", color:'gray'}}>{articleCount}개</span>
            <div style={{width:"1000px"}}>
                <FormGroup style={{float:"right", paddingTop: "10px"}}>
                    <InputGroup size="s">
                        <Input type="text" onKeyDown={(e)=>{ if(e.key=="Enter") serverRequest(1, keyword);} } onChange={inputChange} placeholder='검색어를 입력하세요' style={{boxShadow: 'none', width:"200px", display: "inline-block"}} />
                        <Button outline className="d-flex align-items-center" onClick={(e)=>{serverRequest(1, keyword);}} color="secondary" style={{width:"38px", border:"0.1px solid lightgray"}}>
                            <Search className="ml-auto" style={{margin: '0 -3px 0 -2px', fontSize: '1.5rem' }}/>
                        </Button>
                    </InputGroup>
                    <div ref={radioRef} style={{width:"230px", padding:"3px 23px", display:"none"}}>
                        <InputGroup style={{width:"208px"}}>
                            <Input type="checkbox" name="TechQue" onChange={(e)=>{e.preventDefault()}}/>
                            <Label htmlFor='TechQue'>TechQue</Label> &nbsp;
                            <Input type="checkbox" name="Carrier" onChange={(e)=>{e.preventDefault()}}/>
                            <Label htmlFor='Carrier'>Carrier</Label> &nbsp;
                            <Input type="checkbox" name="Devlife" onChange={(e)=>{e.preventDefault()}}/>
                            <Label htmlFor='Devlife'>Devlife</Label>
                        </InputGroup>
                    </div>
                </FormGroup>
            </div>
        </div>
        {(option == "Cokkiri" || option == "Mammoth") && <MyPostRecruit recruitList={recruitList} dType={option}/>}
        {option == "Coggle" && <MyPostCoggle coggleList={coggleList}/>}
        <div style={{marginTop:"50px", textAlign:"center"}}>
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
    </div>)
}