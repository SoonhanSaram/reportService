import { useEffect, useState } from 'react';
import { useCommonContext } from '../../provider/common';
import { createProject, getEmployee } from '../../js/apis/api/project';
import { checkList, translate } from '../../js/common';

// 모달 컴포넌트
const Modal = (props) => {
    const { openModal, setClickedCorp, validateAndFetch, clickedCorp, setEmployee, employee, clickedList, setClickedList, inputValues, setInputValues } = useCommonContext();

    const [corporationList, setCorporationList] = useState([]);

    const [type, setType] = useState(props.type);

    useEffect(() => {
        if (type === 'searchEmploy') {
            async function fetchData() {
                await getEmployee(0, 20, '', setEmployee)
            }
            if (type === 'searchEmploy') {
                fetchData();
                console.log(employee);

            } else {
                return null
            }
        }

        setClickedList([]);

    }, [])

    console.log(clickedList);


    // inputValue 핸들러
    const handleChange = (e) => {
        const name = e.target.name;
        // 여러 input 에 사용하기 때문에 value 값이 type 에 따라 바뀜
        const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // 회사 리스트를 가져오기 위한 fetch함수
    const fetchCorporationList = async () => {
        const fetchOption = {
            method: "GET",
        }

        const response = await fetch(`${process.env.REACT_APP_CORPORATION_LIST}/${inputValues}`, fetchOption)
        const result = await response.json();
        console.log(result);

        if (response.status === 200) {
            setCorporationList(result);
        } else {

        }

    }

    // 클릭한 회사 리스트를 저장하는 함수 
    const ClickCorporation = (item) => {
        setClickedCorp(item);
        console.log(clickedCorp);
        openModal()
    }

    // 회사 리스트를 받아서 테이블에 표시하기 위한 함수
    const corpList = () => {
        if (corporationList.length >= 1) {
            return corporationList.map((item, index) => (
                <tr key={index}>
                    <td onClick={() => ClickCorporation(item)}>{item.corp_name}</td>
                    <td>{item.corp_number}</td>
                </tr>
            ));
        }
    }

    const employeeList = () => {
        if (employee.length >= 1) {
            return employee.map((item, i) => {
                return (
                    <tr key={i}>
                        <td><input type='checkbox' onClick={(e) => checkList(e, item, setClickedList)} /></td>
                        <td>{item.user_name}</td>
                        <td>{translate(item.user_authority)}</td>
                    </tr>
                );
            });
        }
    }

    const contents = () => {
        switch (type) {
            case 'saveForm':
                return (
                    <div className="modal_content">
                        <div className="modal_title">
                            <h3>보고서 양식 파일 저장</h3> <button className="btn close" onClick={openModal}> X </button>
                        </div>
                        <input placeholder='양식 이름' name='fileTitle' onChange={(e) => handleChange(e)} maxLength={15} />
                        {/* 특정 파일만 첨부 할 수 있도록 제한한 input */}
                        <input type='file' name='file' onChange={(e) => handleChange(e)} accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .hwp" />
                        <button className="btn" onClick={() => validateAndFetch(inputValues.fileTitle, inputValues.file)}>파일 저장</button>
                        <button className='btn close' onClick={openModal}> 취소 </button>
                    </div>)
            case 'searchEmploy':
                return (
                    <div className='modal_content'>
                        <div className='modal_title'>
                            <h3>사원 검색</h3> <button className='btn' onClick={openModal}> 닫기</button>
                        </div>
                        <input placeholder='사원명 검색' />
                        <table>
                            <thead>
                                <tr>
                                    <th>체크</th>
                                    <th>사원명</th>
                                    <th>사원직급</th>
                                    {/* <th>사내번호</th> */}
                                    {/* <th>담당</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {employeeList()}
                            </tbody>
                        </table>
                        <div className='button-wrapper'>
                            <button className='btn' onClick={openModal}>취소</button>
                            <button className='btn' onClick={openModal}>추가</button>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="modal_content">
                        <div className="modal_title">
                            <h3>회사 찾기</h3> <button className="btn close" onClick={openModal}> &times; </button>
                        </div>
                        <input name={'companyName'} value={inputValues.companyName} onChange={(e) => setInputValues(e.target.value)} />
                        <button className="btn" onClick={fetchCorporationList}>회사 찾기</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>회사명</th>
                                    <th>사업자번호</th>
                                </tr>
                            </thead>
                            <tbody>
                                {corpList()}
                            </tbody>
                        </table>
                    </div>
                )
        }
    }

    return (
        <div className="modal_box">
            {contents()}
        </div >
    )
}

export default Modal;