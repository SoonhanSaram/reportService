import { useEffect, useRef } from "react";
import { useCommonContext } from "../../provider/common";
import Modal from "../login/modal";
import { handleInputValues } from "../../js/common";
import { createProject } from "../../js/apis/api/project";

export const CreateProject = () => {

    const { isOpenModal, openModal, inputValues, setInputValues, clickedList, setClickedList } = useCommonContext();

    const inputRef = useRef([]);

    useEffect(() => {

    }, [])

    const cloumnNames = ['프로젝트명', '프로젝트 담당자', '프로젝트 목표', '프로젝트 기간']
    const inputNames = ['title', 'manager', 'objective', 'period'];

    // ref 배열화하기 & 각 input 에 ref 지정
    const tableBody = () => {
        return cloumnNames.map((e, i) => (
            <tr className="long_content" key={i}>
                <td className="long_content">{e}</td>
                <td>
                    <div>
                        <input name={inputNames[i]} ref={(el) => inputRef.current[i] = el} onChange={(el) => handleInputValues(el, setInputValues)} />
                    </div>
                </td>
            </tr>
        ));
    }

    const member = () => {
        return clickedList.map((e, i) => (
            <><span>{i + 1} : {e.user_name}</span><br /></>
        ));
    }


    return (
        <div id="reportWrapper">
            <table className="table-type2">
                <thead>
                    <tr>
                        <th colSpan={2}><h3 >프로젝트 생성</h3></th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody()}
                    <tr className="long_content">
                        <td className="long_content">팀원</td>
                        <td>{member()}</td>
                    </tr>
                </tbody>
            </table>
            <div className="button-wrapper">
                <button className="btn" onClick={openModal}>팀원 초대</button>
                <button className="btn" onClick={() => createProject(inputValues, clickedList)}>승인요청</button>
            </div>
            {isOpenModal ? <Modal type='searchEmploy' /> : null}
        </div>
    )
}
