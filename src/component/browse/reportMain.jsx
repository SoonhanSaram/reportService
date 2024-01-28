import { useEffect } from "react";
import { useCommonContext } from "../../provider/common"
import { getSimpleList } from "../../js/apis/api/report";


export const ReportMain = () => {
    const { getToken, dailyReportList, setDailyReportList, setPaging, paging, report, setReport, userInfo } = useCommonContext();

    useEffect(() => {
        getSimpleList(0, 5, 'daily', setDailyReportList);
    }, [])

    return (
        <div>
            <p>이름 : </p>
            <p>소속 : {userInfo.belongto}</p>
            <p>직급 : </p>
        </div>
    )
}

