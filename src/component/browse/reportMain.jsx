import { useEffect } from "react";
import { useCommonContext } from "../../provider/common"
import { Paging } from "../common/pagination";

export const ReportMain = () => {
    const { userInfo, getToken, dailyReportList, setDailyReportList, setPaging, paging } = useCommonContext();

    const { userName } = userInfo

    const getList = async (user) => {
        const queryString = new URLSearchParams({
            userName: user,
        })
        const fetchOption = {
            method: 'GET',
            headers: {
                'athorization': `Bearer ${getToken()}`
            }
        }

        const response = await fetch(`/content/getReports?${queryString}`, fetchOption)

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
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>회사명</th>
                        <th>사업자번호</th>
                        <th>사원 수</th>
                    </tr>
                </thead>
            </table>
            <Paging callback={getList} />
        </>
    )
}