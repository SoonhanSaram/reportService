import { useNavigate } from 'react-router-dom';
import { useCommonContext } from '../../provider/common'
import Modal from './modal'
import { useEffect, useState } from 'react';

export const UserRegist = () => {
    const { openModal, isOpenModal, setClickedCorp, clickedCorp } = useCommonContext();
    const navigate = useNavigate();
    // 유저 중복을 확인하기 위한 state
    const [isCertified, setIsCertified] = useState();
    // 비밀번호 일치여부 확인을 위한 state
    const [isCheckedPassword, setIsCheckedPassword] = useState();

    // 재직회사 input 초기화
    useEffect(() => {

    })

    // 뒤로가기 함수
    function historyBack() {
        setClickedCorp('');
        navigate(-1);
    }

    // 여러 input 을 하나의 state 로 관리
    const [input, setInput] = useState({
        userName: '',
        userPassword: '',
        userPasswordCheck: '',
    })

    // 구조 분리된 value 값
    const { userName, userPassword, userPasswordCheck } = input

    const onChangeInput = (e) => {
        // 구조 분리 
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        })

        if (name === 'userName') {
            setIsCertified(true);
        }
    }

    // 아이디 중복 확인을 위한 fetch 함수
    const validateUserName = async () => {

        if (userName === '') {
            alert("아이디를 입력해주세요")
            return null;
        }

        const fetchOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userName": userName
            })
        }

        const response = await fetch(process.env.REACT_APP_USERNAME_VALIDATE, fetchOption);
        const result = await response.json()


        if (result != null) {
            setIsCertified(true);
        } else if (result == null) {
            setIsCertified(false);
        }
    }

    // 비밀번호 & 비밀번호 확인이 일치하는 지 확인하는 함수
    const checkPassword = () => {
        if (userPassword === userPasswordCheck) {
            setIsCheckedPassword(true)
        } else {
            setIsCheckedPassword(false)
        }
    }

    // 유저 회원가입을 위한 fetch 함수
    const fetchUserRegist = async (clickedCorp) => {

        console.log(clickedCorp);

        const fetchOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uName: userName,
                uPassword: userPassword,
                uCorporation: clickedCorp.corp_number
            })
        }
        if (isCertified === false && isCheckedPassword === true) {
            const response = await fetch(process.env.REACT_APP_USER_REGIST_URL, fetchOption)

            if (response.status === 200) {
                alert("회원가입이 완료되었습니다.")
                historyBack()
            } else if (response.status === 403) {
                alert("회원가입 중 오류가 발생했습니다.")
                // 새로고침
                window.location.replace("/")
            }
        } else {
            alert("회원가입 정보를 확인해 주세요.")
        }
    }

    return (
        <div className="regist">
            <h2 className='title'>유저 회원가입</h2>
            <div className='list'>
                <label>아이디 : </label>
                <span><input name='userName' value={userName} onChange={onChangeInput} maxLength={20} /><button className="btn" onClick={validateUserName} >아이디 확인</button></span>
                {isCertified === false ? <p className='accept'>사용 할 수 있는 아이디입니다.</p> : <p className='warning'>사용 할 수 없는 아이디입니다.</p>}
                <label>비밀번호 : </label>
                <input type="password" name='userPassword' value={userPassword} onChange={onChangeInput} maxLength={20} />
                <label>비밀번호 확인 : </label>
                <input type="password" name='userPasswordCheck' value={userPasswordCheck} onChange={onChangeInput} onKeyUp={checkPassword} maxLength={20} />
                {isCheckedPassword === true ? <p className='accept'>비밀번호가 일치합니다</p> : <p className='warning'>비밀번호가 일치하지않습니다.</p>}
                <label>재직회사 :</label>
                <span><input disabled={true} name='userCorporation' value={clickedCorp !== undefined ? clickedCorp.corp_name : null} /><button onClick={openModal}>회사 찾기</button></span>
            </div>
            <button className="btn" onClick={() => fetchUserRegist(clickedCorp)}>가입</button>
            <button className="btn" onClick={historyBack}>뒤로가기</button>
            {isOpenModal ? <Modal /> : null}
        </div>
    )
}

