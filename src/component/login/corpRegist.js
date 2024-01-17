// 인라인 styled 는 코드 복잡성, 재활용이 힘듦
// css import css class 명 충돌하는 경우도 발생
import { useNavigate } from 'react-router-dom'
import { useCommonContext } from '../../provider/common'
import Modal from './modal'
import { useState } from 'react'

export const CorpRegist = () => {
    const { isOpenModal } = useCommonContext()
    const [isCheckedPassword, setIsCheckedPassword] = useState();

    // 사업자 번호 인증 확인을 위한 state 
    const [isCertified, setIsCertified] = useState()
    // 사업자 아이디 중복 확인을 위한 state 
    const [isCertifiedId, setIsCertifiedId] = useState()

    // 여러 input 을 하나의 state 로 관리
    const [input, setInput] = useState({
        corporationIdentified: '',
        corporationName: '',
        corporationTel: '',
        userName: '',
        userPassword: '',
        userPasswordCheck: '',
    })

    // 구조 분리된 value 값
    const { corporationIdentified, corporationName, corporationTel, userName, userPassword, userPasswordCheck } = input

    const onChangeInput = (e) => {
        // 구조 분리 
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        })

        if (name === 'corporationIdentified') {
            setIsCertified(true);
        }
    }

    // 뒤로가기 함수
    const navigate = useNavigate();
    function historyBack() {
        navigate(-1);
    }

    // 비밀번호 & 비밀번호 확인이 일치하는 지 확인하는 함수
    const checkPassword = () => {
        if (userPassword === userPasswordCheck) {
            setIsCheckedPassword(true)
        } else {
            setIsCheckedPassword(false)
        }
    }

    // 사업자 번호 인증을 위한 fetch 함수
    const validateCorporation = async () => {

        if (corporationIdentified === '') {
            alert("사업자 번호를 입력해주세요")
            return null;
        }

        const fetchOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "b_no": corporationIdentified
            })
        }
        console.log(process.env.REACT_APP_CORPORATION_VALIDATE);
        const response = await fetch(process.env.REACT_APP_CORPORATION_VALIDATE, fetchOption);

        if (response === null) {
            setIsCertified(true);
        } else {
            setIsCertified(false);
        }
    }

    //  기업회원 아이디 중복확인
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
                "uName": userName
            })
        }

        try {
            const response = await fetch(process.env.REACT_APP_CORPORATION_VALIDATEADMIN, fetchOption);
            if (response.ok) {
                const result = await response.json();
                if (result !== null) {
                    setIsCertifiedId(true);
                } else {
                    setIsCertifiedId(false);
                }
            } else {
                alert(`Failed to validate username. Status: ${response.status}`);
            }
        } catch (error) {
            alert("Error during username validation:", error);
        }
    }

    // 기업 회원가입을 위한 fetch 함수
    const registFetch = async () => {
        if (isCertified === false) {
            const fetchOption = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    corNumber: corporationIdentified,
                    corName: corporationName,
                    corTel: corporationTel,
                    uName: userName,
                    uPassword: userPassword,
                })
            }

            const result = await fetch(process.env.REACT_APP_CORPORATION_REGIST_URL, fetchOption);

            console.log(result);
            if (result.status === 200) {
                alert("회원가입이 완료되었습니다.")
                historyBack()
            } else if (result.status === 403) {
                alert("회원가입 중 오류가 발생했습니다.")
                // 새로고침
                window.location.replace("/")
            }
        }
    }

    // input 값을 전화번호 형식으로 바꿔주는 함수
    function oninputPhone(event) {
        const target = event.target;
        target.value = target.value
            .replace(/[^0-9]/g, '')
            .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
    }

    return (
        <div className="regist">
            <h2 className='title'>기업 회원가입</h2>
            <div className='list'>
                <label>사업자번호 : </label>
                <span><input name="corporationIdentified" value={corporationIdentified} onChange={onChangeInput} /><button className="btn" onClick={validateCorporation}>사업자번호 확인</button></span>
                {isCertified === false ? <p className='accept'>사용 할 수 있는 사업자 번호입니다.</p> : <p className='warning'>사용 할 수 없는 사업자 번호입니다.</p>}
                <label>기업명 : </label><input name="corporationName" value={corporationName} onChange={onChangeInput} />
                <label>관리자 아이디 :      </label>
                <span><input name="userName" value={userName} onChange={onChangeInput} /> <button className="btn" onClick={validateUserName} >아이디 확인</button></span>
                {isCertifiedId === false ? <p className='accept'>사용 할 수 있는 아이디입니다.</p> : <p className='warning'>사용 할 수 없는 아이디입니다.</p>}
                <label>관리자 패스워드 :    </label><input type='password' name="userPassword" value={userPassword} onChange={onChangeInput} />
                <label>관리자 패스워드 확인 </label><input type='password' name="userPasswordCheck" value={userPasswordCheck} onChange={onChangeInput} onKeyUp={checkPassword} />
                {isCheckedPassword === true ? <p className='accept'>비밀번호가 일치합니다</p> : <p className='warning'>비밀번호가 일치하지않습니다.</p>}
                <label>대표 전화번호 :</label><input name="corporationTel" value={corporationTel} onChange={onChangeInput} onInput={oninputPhone} maxLength="14" type='tel' />
                {/* <label>업종 :</label>
                <span><input disabled={true} /><button onClick={openModal}>업종 찾기</button></span> */}
            </div>
            <button className="btn" onClick={registFetch}>가입</button>
            <button className="btn" onClick={historyBack}>뒤로가기</button>
            {isOpenModal ? <Modal /> : null}
        </div>
    )
}

