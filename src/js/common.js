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

    // console.log(role, intersection);


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
            case 'project':
                navigate('/service/projectMain');
                break;
            case 'createProject':
                navigate('/service/createProject');
                break;
            default:
                navigate('/service/dashboard');
                break;
        }
    } else if (role === undefined) {
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
    } else if (role === 'leader') {
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
    } else if (role === 'owner') {
        switch (intersection) {
            case 'report':
                navigate('/owner/report');
                break;
            case 'uploadReport':
                navigate('/owner/uploadReport');
                break;
            case 'project':
                navigate('/owner/project')
                break;
            default:
                navigate('/owner/dashboard');
                break;
        }
    }
}


export const translate = (authority) => {
    const level = ['사장', '팀장', '사원'];
    const index = authority - 3;

    return level[index];
}

// 체크리스트 만들기 
export const checkList = (e, item, setClickedList) => {
    const isChecked = e.target.checked;

    if (isChecked === true) {
        setClickedList((prevList) => [...prevList, item]);
    } else {
        setClickedList((prevList) => prevList.filter((e) => e !== item));

    }
}

export const handleInputValues = (e, setInputValues) => {
    const name = e.target.name
    const value = e.target.value

    // name 이 image 일 때, binary 형태로 변환하여 저장
    // name key 의 value 는 파일명으로 저장 
    // file 에는 binary 형태로 저장
    if (name === 'image') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setInputValues((prev) => ({
                ...prev,
                [name]: file.name,
                file: reader.result,
            }))
        }
    }
    setInputValues((prev) => ({
        ...prev,
        [name]: value,
    }))
}

// 뒤로가기 함수
export function historyBack(navigate) {
    navigate(-1);
}

// drag & drop 으로 이미지 업로드
export const handleDrop = (e, setInputValues, setDragOver) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];

    const reader = new FileReader();
    if (file) {
        console.log('file', file);
        reader.readAsDataURL(file);
        reader.onload = () => {
            setInputValues((prev) => ({
                ...prev,
                image: file.name,
                file: reader.result,
            }))
        }
        setDragOver(false);
    } else return;
}

// binany 형태의 이미지를 다운로드 하는 함수

// 인쇄할 수 있도록 하는 함수
export const print = () => {
    window.print();
}