import { getToken, handleNavi, setUser } from "../../common";

export const userLogin = async (input, url, setUserInfo, userInfo, navigate) => {
    const { userName, userPassword } = input;

    if (userName === '' || userPassword === '') {
        alert('로그인 정보를 입력해주세요.')
        return null;
    }

    const fetchOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uName: userName,
            uPassword: userPassword,
        })
    }

    try {
        const response = await fetch(url, fetchOption);
        const result = await response.json();
        if (response.status === 200) {
            alert('로그인 성공');
            const token = result.data['accesstoken'];
            // console.log(token);
            await setUser(token, setUserInfo)
            handleNavi(navigate, '', userInfo.userAuthority);
        } else {
            alert('로그인 실패')
        }
    } catch (error) {
        alert(error, '체크1')
        return null
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
            userBelongto: null,
            isLogin: false
        }));
    } else {
        alert('서버 로그아웃 실패');
    }
    // userInfo 와 localStorage의 accessToken 삭제
    setUserInfo((prev) => ({
        ...prev,
        userName: null,
        userAuthority: null,
        userBelongto: null,
        isLogin: false,
    }));

    localStorage.clear();

    window.location.href = '/';
}