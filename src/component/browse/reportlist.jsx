import { useState } from "react";
import { useCommonContext } from "../../provider/common"
import { Paging } from "../common/pagination";
import { formatDate, formatStatus, formatReportType } from '../../js/reportCommon.js'
import { DailyReport } from "./dailyReport.jsx";
import { handleNavi } from "../../js/common.js";
import { Navigate, useNavigate } from "react-router-dom";


export const ReportList = () => {
    const { getToken, dailyReportList, setDailyReportList, setPaging, paging, report, setReport, userInfo } = useCommonContext();

    const [detail, setDetail] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const navigate = useNavigate();

    const getList = async (offset, limit) => {
        const qeueryString = new URLSearchParams({
            offset: offset,
            limit: limit,
        })

        const fetchOption = {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${getToken()}`
            }
        }
        const response = await fetch(`/content/getReports?${qeueryString}`, fetchOption)
        const result = await response.json();
        console.log(result.list, result.count);
        if (response.status === 200) {
            setDailyReportList(result.list);
            setPaging(
                {
                    ...paging,
                    totalItems: result.count
                }
            )
        } else {
            alert(result.message);
        }
    };

    const handleIndex = (e, setDetail, isOpenModal, setIsOpenModal) => {
        // console.log(dailyReportList, e);
        setReport(dailyReportList[e]);
        setDetail(!detail);
        console.log(report);
        setIsOpenModal(!isOpenModal);
    }

    // 리스트 업을 위한 함수 
    const viewReportList = () => {
        if (dailyReportList != undefined && dailyReportList.length > 0) {
            return dailyReportList.map((item, index) => (
                <tr key={item.report_seq}>
                    <td>{index + 1}</td>
                    <td style={{ cursor: 'pointer' }} onClick={() => handleIndex(index, setDetail, isOpenModal, setIsOpenModal)}>{formatReportType(item.report_type)}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{formatDate(item.work_date)}</td>
                    <td>{formatStatus(item.approval_status)}</td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan={5}>검색된 업무 보고서가 없습니다.</td>
                </tr>
            );
        }
    };

    return (
        <div className='table_wrap'>
            <table>
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>보고서 형식</th>
                        <th>작성일자</th>
                        <th>작업일자</th>
                        <th>승인상태</th>
                    </tr>
                </thead>
                <tbody>
                    {viewReportList()}
                </tbody>
            </table>
            <Paging callback={getList} />
            <button className='btn' onClick={() => handleNavi(navigate, 'uploadReport', userInfo.userAuthority)}>보고서 작성</button>
            {isOpenModal ?
                <div className="modal_box">
                    <div id='reportWrapper'>
                        <DailyReport detail={true} />
                    </div>
                    <button className='btn close' onClick={() => setIsOpenModal(!isOpenModal)}>확인</button>{userInfo.userAuthority === 1 ? <><button className="btn">승인</button> <button className="btn">반려</button></> : null}
                </div> : null}
        </div>
    )
}