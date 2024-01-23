import { jwtDecode } from "jwt-decode";
import { logout } from "./apis/api/login";


// responsebody 에서 받은 토큰을 localstorage 에 저장하는 함수
export const setToken = (token) => localStorage.setItem('accessToken', token)

// accessToken 을 localstorage 에서 가져오는 함수
export const getToken = () => localStorage.getItem('accessToken')

// enter 키 로그인
export const pressEnter = (e, method) => {
    const key = e.code
    if (key === "Enter") {
        method();
    }
}

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
            isLogin: true,
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
        logout(setUserInfo, userInfo);
    }
}

export const handleNavi = (navigate, intersection, role) => {
    console.log(intersection, role);

    // switch case 문을 이용한 navigate 이벤트
    if (role === 'admin') {
        switch (intersection) {
            case 'member':
                navigate('/admin/member')
                break;
            case 'form':
                navigate('/admin/form')
                break;
            case 'corp':
                navigate('/admin/corporation')
                break;
            default:
                navigate('/admin/dashboard')
                break;
        };
    } else if (role === 'mate') {
        switch (intersection) {
            case 'report':
                navigate('/service/report');
                break;
            case 'uploadReport':
                navigate('/service/uploadReport');
                break;
            default:
                navigate('/service/dashboard');
                break;
        }
    } else if (role === undefined) {
        console.log('체크1', intersection);
        switch (intersection) {
            case 'cor':
                navigate('/corRegist')
                break;
            case 'user':
                navigate('/userRegist')
                break;
            default:
                navigate('/')
                break
        }
    }
}



