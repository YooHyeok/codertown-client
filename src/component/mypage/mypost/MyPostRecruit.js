import { Table, Tooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useState } from "react";

export default function MyPostRecruit({recruitList, dType}) {

    const [tooltipOpen, setTooltipOpen] = useState({});
    const toggleTooltip = (recruitNo) => {
        setTooltipOpen({ ...tooltipOpen, [recruitNo]: !tooltipOpen[recruitNo], });
    };

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
                            인기💞
                        </th>
                        <th>
                            조회👀
                        </th>
                    </tr>
                </thead>
                <tbody style={{overflow:"auto"}}>
                    {recruitList.map((obj) => {
                        return (
                        <tr key={obj.recruitDto.recruitNo}>
                            <td>{obj.recruitDto.recruitNo}</td>
                            <td style={{textAlign:'left'}}>
                                <Link id={"Tooltip" + obj.recruitDto.recruitNo} onMouseEnter={() => toggleTooltip(obj.recruitDto.recruitNo)} onMouseLeave={() => toggleTooltip(obj.recruitDto.recruitNo)} 
                                to={`/${dType == 'Cokkiri' ? 'cokkiri' : 'mammoth'}-detail/${obj.recruitDto.recruitNo}`}>
                                    {obj.recruitDto.title}
                                </Link>
                                {(dType == 'Cokkiri' && obj.projectDto ) && 
                                <Tooltip style={{ width: "300px" }} placement="bottom" isOpen={tooltipOpen[obj.recruitDto.recruitNo]} target={"Tooltip" + obj.recruitDto.recruitNo}>
                                    <Table bordered={true} style={{ margin: "5px auto" }} >
                                        <thead>
                                            <tr>
                                                <th>파트 / 현황</th>
                                                <th>모집 인원</th>
                                                <th>남은 자리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {obj.projectDto.projectParts.filter((obj)=>{
                                                return obj.partNo !== 1;
                                            }).filter((obj)=>{
                                                return obj.partNo !== 1;
                                            }).map((obj) => {
                                                return (
                                                    <tr key={obj.partNo}>
                                                        <td>{obj.partName}</td>
                                                        <td>{obj.recruitCount}</td>
                                                        <td>{obj.recruitCount - obj.currentCount}</td>
                                                    </tr>
                                                )
                                            })}

                                        </tbody>
                                    </Table>
                                </Tooltip>}
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