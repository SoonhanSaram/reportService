import { jwtDecode } from "jwt-decode";

// userInfo setting 을 위한 함수
export const setUser = async (token, setUserInfo) => {
    const decodingData = jwtDecode(token);
    if (decodingData) {
        setUserInfo({
            userName: decodingData['name'],
            userAuthority: decodingData['autho'],
            userBelongto: decodingData['cName'],
        });
    } else {
        setUserInfo();
    }
}

export const refreshUser = async (result, setUserInfo, cookie) => {
    if (!result.ok) {
        const token = localStorage.getItem('accessToken');
        const refreshToken = cookie.get('refreshToken');
        const fetchOption = {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`,
                'refresh': refreshToken,
            }
        }
        const refreshResponse = await fetch('/refresh', fetchOption);
        const refreshResult = await refreshResponse.json();
        console.log(refreshResult);


        if (refreshResult.status === 200) {
            const newToken = refreshResult.data.accessToken
            setUser(newToken, setUserInfo);
            console.log('실행');

        } else {
            setUserInfo();
            console.log('실행2');
        }
    } else {
        return null;
    }
}