import { useEffect } from "react";
import { useCommonContext } from "../../provider/common"
import { getSimpleList } from "../../js/apis/api/report";
import { Paging } from "../common/pagination";


export const ReportMain = () => {
    const { getToken, dailyReportList, setDailyReportList, setPaging, paging, report, setReport, userInfo } = useCommonContext();


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

    /**
    useEffect(() => {
        getSimpleList(0, 5, 'daily', setDailyReportList);
    }, [])
     */
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
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <Paging callback={getList} />
        </div>
    )
}

