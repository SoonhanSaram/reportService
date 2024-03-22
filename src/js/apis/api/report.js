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

export const AIRecommendation = async (content) => {
    console.log('123');

    //  content value 값이 없을 경우 key 값 삭제 모든 key 값을 순회
    const title = content['workingTitle'];
    // content 에서 workingTitle key, toworkDay, toworkMonth, toworkYear key 값을 제외한 나머지를 추출
    const contents = Object.keys(content).reduce((acc, key) => {
        if (key !== 'workingTitle' && key !== 'toworkDay' && key !== 'toworkMonth' && key !== 'toworkYear') {
            acc[key] = content[key];
        }
        return acc;
    }, {});

    console.log('title', title, 'contents', contents);

    const fetchOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 'workingTitle': title, 'contents': contents }),
    }
    // Proxy error: Could not proxy request /content/AiRecommendation from localhost:3000 to http://127.0.0.1:3010/.
    // See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (ECONNRESET). 에러 발생    
    const response = await fetch('/content/AiRecommendation', fetchOption);

    return response.json() ?? null;
}