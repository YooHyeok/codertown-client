import { Table} from 'reactstrap';
import { BsFillSuitHeartFill } from "react-icons/bs"
import { Link } from 'react-router-dom';

export default function MyPostRecruit({recruitList, dType}) {



    return (
        <div style={{borderTop: '0.1px solid lightgray', height:"420px", margin:"20px auto"}}>
            <Table>
                <thead>
                    <tr>
                        <th>No</th>
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
                    {recruitList.map((obj) => {
                        return (
                        <tr key={obj.recruitDto.recruitNo}>
                            <td>{obj.recruitDto.recruitNo}</td>
                            <td style={{textAlign:'left'}}>
                                <Link to={`/${dType == 'Cokkiri' ? 'cokkiri' : 'mammoth'}-detail/${obj.recruitDto.recruitNo}`}>
                                    {obj.recruitDto.title}
                                </Link>
                            </td>
                            <td>{new Date(obj.recruitDto.firstRegDate).toISOString().split('T')[0]}</td>
                            <td>{obj.recruitDto.lastModDate == null ? new Date(obj.recruitDto.firstRegDate).toISOString().split('T')[0] : new Date(obj.recruitDto.lastModDate).toISOString().split('T')[0]}</td>
                            <td>{obj.recruitDto.like}</td>
                            <td>{obj.recruitDto.count}</td>
                        </tr> 
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}