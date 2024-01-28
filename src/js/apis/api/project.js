// 전체 사원을 검색하기 위한 fetch

const token = localStorage.getItem('accessToken');

export const getEmployee = async (offset, limit, user, setEmployee) => {
    console.log(token);
    const qeueryString = new URLSearchParams({
        offset: offset,
        limit: limit,
        user: user,
    })

    const fetchOption = {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    }

    const response = await fetch(`/company/getEmployee?${qeueryString}`, fetchOption);

    const result = await response.json()

    if (response.status === 200) {
        return await setEmployee(result.data);
    } else {
        return alert(result.message)
    }
}

export const createProject = async (inputValues, clickedList) => {
    const { title, manager, objective, period } = inputValues;
    console.log(token);
    const fetchOption = {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            manager: manager,
            objective: objective,
            period: period,
            member: clickedList
        })
    }

    const response = await fetch('/company/createProject', fetchOption);
    const result = await response.json();
    if (response.status === 200) {
        return alert(result.message);
    } else {
        return alert(result.message);
    }
}