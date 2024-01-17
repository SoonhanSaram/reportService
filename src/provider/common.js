/**
 * Provider 를 전역 state 관리
*/
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { Cookies } from 'react-cookie'

// 컴포넌트에서 공통적으로 사용 할 store 개시
const CommonContext = createContext();

// 다른 컴포넌트에서 store 를 불러올 함수 정의
const useCommonContext = () => {
    return useContext(CommonContext);
}

const CommonContextPovider = ({ children }) => {
    // modal on/off 를 할 변수
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [clickedCorp, setClickedCorp] = useState();

    const cookie = new Cookies();

    // memberList 받을 state
    const [memberListInfo, setMemberListInfo] = useState({
        memberList: null,
        memberLength: 0,
    })

    // jwt 에서 받은 유저 정보를 저장하는 state
    const [userInfo, setUserInfo] = useState({
        userName: '',
        userAuthority: '',
        userBelongto: ''
    });

    // pagination 을 위한 state
    const [paging, setPaging] = useState({
        page: 1,
        viewItems: 20,
        totalItems: 0,
        offset: 0,
        limit: 20,
    }
    );

    const [dailyReportList, setDailyReportList] = useState();

    // responsebody 에서 받은 토큰을 localstorage 에 저장하는 함수
    const setToken = (token) => localStorage.setItem('accessToken', token)

    // accessToken 을 localstorage 에서 가져오는 함수
    const getToken = () => localStorage.getItem('accessToken')

    // refreshToken 을 cookie 에서 가져오는 함수
    const getRefreshToken = () => cookie.get('refreshToken')

    // userInfo setting 을 위한 함수
    const setUser = async (token) => {
        const decodingData = jwtDecode(token);
        console.log(decodingData);
        setUserInfo({
            userName: decodingData['name'],
            userAuthority: decodingData['autho'],
            userBelongto: decodingData['cName'],
        })
    }

    // accesstoken 이 있다면 회원정보 state 에 재할당
    useEffect(() => {
        const token = getToken();
        const refreshToken = getRefreshToken();

        if (token) {
            setUser(token);
        } else if (!token && refreshToken) {

        } else if (!token && !refreshToken) {

        }
        console.log('이펙트 실행');
    }, [getToken()])

    function openModal() {
        setIsOpenModal(!isOpenModal)
    }

    const logOut = async () => {
        /**
        const fetchOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uName: userName
            })
        }

        const response = await fetch(process.env.REACT_APP_USER_LOGOUT, fetchOption);

        if (response.status === 200) {
            alert('서버 로그아웃 성공')
            // userInfo 와 localStorage의 accessToken 삭제
            setUserInfo({
                ...userInfo,
                userName: null,
                userAuthority: null,
                userBelongto: null
            })
            localStorage.clear();

            window.location.href = '/';
        } else {
            alert('서버 로그아웃 실패');
            // userInfo 와 localStorage의 accessToken 삭제
            setUserInfo({
                ...userInfo,
                userName: null,
                userAuthority: null,
                userBelongto: null
            })
            localStorage.clear();

            window.location.href = '/';
        }
         */
        setUserInfo({
            ...userInfo,
            userName: null,
            userAuthority: null,
            userBelongto: null
        })
        localStorage.clear();

        window.location.href = '/';
    }

    // validate file 함수
    const validateAndFetch = async (fileTitle, file) => {

        // fetch file 함수
        const fetchFile = async (fileTitle, file) => {

            // multer 에서 받을 데이터는 formData 형식으로 가야하기 때문에 기존에 쓰던 JSON.stringify() 가 아니라 
            // 새로운 formData 를 생성 후 전송
            const formData = new FormData();

            const fileExt = file.name.split('.').pop(); //file.name 을 '.' 을 기준으로 문자열 끝까지 반환(pop()); 확장자명
            console.log(file);

            formData.append('fileTitle', fileTitle);
            formData.append('file', file);
            formData.append('fileExt', fileExt);

            const fetchOption = {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${getToken()}`,
                    // 파일 업로드를 위한 content type 설정
                    // 'Content-Type': 'multipart/form-data',
                },
                body: formData,
            };
            const response = await fetch('/admin/uploadFormFile', fetchOption);
            const result = response.json();
        }

        if (!fileTitle) {
            alert('파일명을 입력해주세요');
        } else if (fileTitle && fileTitle.length > 15) {
            alert('파일명 1 ~ 15 글자 사이 입니다.')
        } else if (!file) {
            alert('파일을 등록해주세요')
        } else {
            await fetchFile(fileTitle, file);
            openModal();
        }
    }

    const props = { openModal, isOpenModal, clickedCorp, setClickedCorp, setUserInfo, userInfo, setToken, getToken, memberListInfo, setMemberListInfo, paging, setPaging, logOut, validateAndFetch, getRefreshToken, dailyReportList, setDailyReportList }
    return <CommonContext.Provider value={props}>{children}</CommonContext.Provider>;
}

export { CommonContextPovider, useCommonContext };
