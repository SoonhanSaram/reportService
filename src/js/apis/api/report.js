import { getToken } from "../../common";

// 기본 GetList
export const getList = async (offset, limit, type, setDailyReportList, setPaging, paging) => {
    const qeueryString = new URLSearchParams({
        offset: offset,
        limit: limit,
        type: type,
    })

    const fetchOption = {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${getToken()}`
        }
    }
    const response = await fetch(`/content/getReports?${qeueryString}`, fetchOption)
    const result = await response.json();
    // console.log(result.list, result.count);
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

// 간략 GetList
export const getSimpleList = async (offset, limit, type, setDailyReportList) => {
    const qeueryString = new URLSearchParams({
        offset: offset,
        limit: limit,
        type: type,
    })

    const fetchOption = {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${getToken()}`
        }
    }
    const response = await fetch(`/content/getReports?${qeueryString}`, fetchOption)
    const result = await response.json();
    // console.log(result.list, result.count);
    if (response.status === 200) {
        setDailyReportList(result.list);
    } else {
        alert(result.message);
    }
};