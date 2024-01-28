import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useCommonContext } from "../../provider/common";
import { handleNavi, pressEnter } from "../../js/common.js";
import { userLogin } from "../../js/apis/api/login.js";
import { Chat } from "../common/chat.js";
export const Login = () => {

    const { setUserInfo, userInfo } = useCommonContext();

    // useEffect 에서 return 값이 함수가 아닌 다른 값을 호출 하면 destroy() 에러가 발생
    useEffect(() => {
        const userAuthority = userInfo.userAuthority;
        if (userAuthority) {
            handleNavi(navigate, '', userAuthority);
        }
    }, [userInfo])

    // input state 를 선언하고 구조 분리
    const [input, setInput] = useState({
        userName: '',
        userPassword: '',
    });

    // 분리한 state 를 각 input onChange 이벤트에서 처리
    const onChangeInput = (e) => {
        const { name, value } = e.target
        setInput({
            ...input,
            [name]: value,
        })
    }
    const navigate = useNavigate();

    return (
        <div id="container">
            <div className="regist">
                <h2 className="title">보고, 보고서 로그인</h2>
                <input placeholder="아이디" name="userName" onChange={onChangeInput} onKeyDown={(e) => pressEnter(e)} />
                <input placeholder="비밀번호" type="password" name="userPassword" onChange={onChangeInput} onKeyDown={(e) => pressEnter(e, () => userLogin(input, process.env.REACT_APP_USER_LOGIN, setUserInfo, userInfo, navigate))} />
                <button className="btn" onClick={() => userLogin(input, process.env.REACT_APP_USER_LOGIN, setUserInfo, userInfo, navigate)}>로그인</button>
                <button className="btn" onClick={() => handleNavi(navigate, 'cor',)}>기업회원가입</button>
                <button className="btn" onClick={() => handleNavi(navigate, 'user',)}>유저회원가입</button>
            </div>
            <Chat />
        </div>
    )
}