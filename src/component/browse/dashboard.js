import { useEffect } from "react";
import { useCommonContext } from "../../provider/common"
import { Chart } from "react-google-charts";
import { getSimpleList } from "../../js/apis/api/report";

export const DashBoard = () => {
    // provider 에서 state 가져오기
    const { userInfo, setDailyReportList } = useCommonContext();

    useEffect(() => {
        getSimpleList(0, 5, 'daily', setDailyReportList);
    }, [])

    const chart = () => {
        return (
            <Chart
                chartType="ScatterChart"
                data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                width="100%"
                height="400px"
                legendToggle
            />)
    }


    return (
        <div>
            {userInfo.userAuthority == 'admin' || userInfo.userAuthority == 'manager' ?
                <>
                    <p>관리자 대시보드 위치 입니다.</p>
                    <p>{userInfo.userBelongto}</p>
                    <p>{userInfo.userName}</p>
                    {userInfo.userAuthority}
                    {chart()}
                </> :
                <>
                    <p>기업사용자 위치 입니다.</p>
                    <p>{userInfo.userBelongto}</p>
                    <p>{userInfo.userName}</p>
                    {userInfo.userAuthority}
                </>}

        </div>
    )
}