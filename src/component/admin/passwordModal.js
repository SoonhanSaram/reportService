import { useState } from "react";
import { useCommonContext } from "../../provider/common";


export const PasswordModal = ({ index }) => {
    const { openModal } = useCommonContext();
    const [input, setInput] = useState();

    const userName = index;

    //  비밀번호 변경
    const modifyPassword = async () => {
        const accessToken = localStorage.getItem('accessToken');
        // fetch 옵션 설정
        const fetchOption = {
            method: "PUT",
            headers: {
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName,
                password: input
            })
        };
        const response = await fetch(`/admin/updatePassword`, fetchOption)

        // json data 로 변환
        const result = await response.json();

        if (response.status === 200) {
            alert(result.message)
            openModal()
        } else {
            alert(result.message)
            openModal()
        }
    }

    return (<div className="modal_box">
        <div className="modal_content">
            <div className="modal_title">
                <h3>비밀번호 변경</h3> <button className="close" onClick={openModal}> &times; </button>
            </div>
            <div>
                <input type="password" value={input} onChange={(e) => setInput(e.target.value)} /> <button onClick={modifyPassword}>변경</button> <button onClick={openModal}>취소</button>
            </div>
        </div>
    </div >)
}