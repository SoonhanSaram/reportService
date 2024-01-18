import { jwtDecode } from "jwt-decode";


// responsebody 에서 받은 토큰을 localstorage 에 저장하는 함수
export const setToken = (token) => localStorage.setItem('accessToken', token)

// accessToken 을 localstorage 에서 가져오는 함수
export const getToken = () => localStorage.getItem('accessToken')

// userInfo setting 을 위한 함수
export const setUser = async (token, setUserInfo) => {

    // 한글 깨짐 발견 아래 jwtDecode lib 으로 처리
    // const payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
    // const decodedPayload = base64.decode(payload);
    // const decodingData = JSON.parse(decodedPayload);
    const decodingData = jwtDecode(token);

    if (decodingData) {
        setToken(token);
        return setUserInfo((prev) => ({
            ...prev,
            userName: decodingData['name'],
            userAuthority: decodingData['autho'],
            userBelongto: decodingData['cName'],
        }));

    } else {
        setUserInfo();
        localStorage.clear();
    }
}

export const refreshUser = async (userInfo, setUserInfo, cookie) => {

    if (userInfo) {
        const token = localStorage.getItem('accessToken');
        const refreshToken = cookie.get('refreshToken');
        const fetchOption = {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`,
                'refresh': refreshToken,
            },
            body: JSON.stringify(userInfo)
        }
        const refreshResponse = await fetch('/refresh', fetchOption);
        const refreshResult = await refreshResponse.json();
        console.log(refreshResult);

        if (!refreshResult.ok) {
            document.location.href = '/';
        } else {
            const newToken = refreshResult.data.accessToken;
            setToken(newToken);
            setUser(newToken, setUserInfo);
            console.log('실행 리프레시');
        }
    } else {
        logout(setUserInfo);
    }
}

export const handleNavi = (navigate, intersection) => {
    // switch case 문을 이용한 navigate 이벤트
    switch (intersection) {
        case 'member':
            navigate('/admin/member')
            break;
        case 'user':
            navigate('userRegist')
            break;
        case 'dashboard':
            navigate('dashboard')
            break;
        case 'form':
            navigate('/admin/form')
            break;
        case 'corp':
            navigate('/admin/corporation')
            break;
        default:
            navigate('/')
            break
    }
}

export const logout = async (setUserInfo, userInfo) => {

    console.log(userInfo);

    const fetchOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uName: userInfo.userName
        })
    }

    const response = await fetch(process.env.REACT_APP_USER_LOGOUT, fetchOption);

    if (response.status === 200) {
        alert('서버 로그아웃 성공')
        // userInfo 와 localStorage의 accessToken 삭제
        setUserInfo((prev) => ({
            ...prev,
            userName: null,
            userAuthority: null,
            userBelongto: null
        }));
    } else {
        alert('서버 로그아웃 실패');
    }
    // userInfo 와 localStorage의 accessToken 삭제
    setUserInfo((prev) => ({
        ...prev,
        userName: null,
        userAuthority: null,
        userBelongto: null
    }));

    localStorage.clear();

    window.location.href = '/';
}

