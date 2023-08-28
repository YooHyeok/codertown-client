import { Table} from 'reactstrap';
import { BsFillSuitHeartFill } from "react-icons/bs"
import { Link } from 'react-router-dom';

export default function MyPostRecruit({coggleList}) {



    return (
        <div style={{borderTop: '0.1px solid lightgray', height:"420px", margin:"20px auto"}}>
            <Table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>최초 작성일자</th>
                        <th>최종 수정일자</th>
                        <th>
                            <BsFillSuitHeartFill style={{width:"20px",height:"20px",margin:"0 auto"}}/>
                        </th>
                        <th>
                            조회수                                            
                        </th>
                    </tr>
                </thead>
                <tbody style={{overflow:"auto"}}>
                    {console.log(coggleList)}
                    {coggleList.map((obj) => {
                        return (
                            <tr key={obj.coggleNo}>
                                <td>{obj.coggleNo}</td>
                                <td>{obj.category == 'T' ? 'TechQue' : obj.category == 'C' ? 'Carrier' : 'DevLife'}</td>
                                <td><Link className="postTitle" to={`/coggle-detail/${obj.coggleNo}`}>{obj.title}</Link></td>
                                <td>{new Date(obj.firstRegDate).toISOString().split('T')[0]}</td>
                                <td>{obj.lastModDate == null ? new Date(obj.firstRegDate).toISOString().split('T')[0] : new Date(obj.lastModDate).toISOString().split('T')[0]}</td>
                                <td>{obj.like}</td>
                                <td>{obj.count}</td>
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}