import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useCommonContext } from "../../provider/common";
import { jwtDecode } from "jwt-decode";
export const Login = () => {

    const { setUserInfo, setToken, getRefreshToken, getToken } = useCommonContext();

    // useEffect 에서 return 값이 함수가 아닌 다른 값을 호출 하면 destroy() 에러가 발생
    useEffect(() => {
        const token = getToken();
        if (token) {
            return navigate('/dashboard')
        }
    }, [])

    // input state 를 선언하고 구조 분리
    const [input, setInput] = useState({
        userName: '',
        userPassword: '',
    });
    const { userName, userPassword } = input;

    // 분리한 state 를 각 input onChange 이벤트에서 처리
    const onChangeInput = (e) => {
        const { name, value } = e.target
        setInput({
            ...input,
            [name]: value,
        })
    }

    // jwt 토큰 decoding 을 위한 함수
    const decodingToken = async (token) => {
        // 한글 깨짐 발견 아래 jwtDecode lib 으로 처리
        // const payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
        // const decodedPayload = base64.decode(payload);
        // const decodingData = JSON.parse(decodedPayload);

        const decodingData = jwtDecode(token);
        console.log(decodingData);
        await setUserInfo({
            userName: decodingData['name'],
            userAuthority: decodingData['autho'],
            userBelongto: decodingData['cName'],
        })

    }

    // 로그인을 위한 fetch 함수
    const fetchUserLogin = async () => {

        // input 무결성 
        if (userName === '' & userPassword === '') {
            alert("로그인 정보를 입력해주세요.")
            return null;
        }

        const fetchOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uName: userName,
                uPassword: userPassword
            })
        }

        const response = await fetch(process.env.REACT_APP_USER_LOGIN, fetchOption)
        const result = await response.json()
        const token = result.data.accesstoken

        if (response.status === 200) {
            alert("로그인 성공");
            setToken(token);
            decodingToken(token);
            navigate('/dashBoard');
        } else {
            alert("로그인 실패")
        }

    }

    // enter 키 로그인
    const pressEnter = (e) => {
        const key = e.code

        if (key === "Enter") {
            fetchUserLogin();
        }
    }

    const navigate = useNavigate();

    const navigateHandler = (intersection) => {

        // switch case 문을 이용한 navigate 이벤트
        switch (intersection) {
            case 'cor':
                navigate('corRegist')
                break;
            case 'user':
                navigate('userRegist')
                break;
            default:
                navigate('/')
                break
        }
    }

    return (
        <div id="container">
            <div className="regist">
                <h2 className="title">보고, 보고서 로그인</h2>
                <input placeholder="아이디" name="userName" onChange={onChangeInput} onKeyDown={(e) => pressEnter(e)} />
                <input placeholder="비밀번호" type="password" name="userPassword" onChange={onChangeInput} onKeyDown={(e) => pressEnter(e)} />
                <button className="btn" onClick={fetchUserLogin}>로그인</button>
                <button className="btn" onClick={() => navigateHandler('cor')}>기업회원가입</button>
                <button className="btn" onClick={() => navigateHandler('user')}>유저회원가입</button>
            </div>
        </div>
    )
}