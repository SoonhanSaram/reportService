import { useEffect, useState } from "react"
import { useCommonContext } from "../../provider/common";
import { exportWithExcel } from "../../js/reportxlsx.js";

export const UploadReport = () => {

    const { userInfo, getToken, date } = useCommonContext();

    const [inputValues, setInputValues] = useState({
        toworkDay: undefined,
        toworkMonth: undefined,
        toworkYear: undefined,
        workingTitle: undefined,
    });

    const { toworkDay, toworkMonth, toworkYear } = inputValues;

    const [checked, setChecked] = useState(false);

    const [reportType, setReportType] = useState('1');

    const handleReportType = (e) => {
        setInputValues({
            workingTitle: undefined,
        });
        // console.log(inputValues);
        setReportType(e);
    }

    const handleInputValues = (e) => {
        const name = e.target.name
        const value = e.target.value

        setInputValues({
            ...inputValues,
            [name]: value,
        })
    }

    // 구조분해
    const { year, month, day, dayOfWeek, lastDay } = date;

    // console.log(date);

    // 체크박스 사용 함수
    const handleCheckBox = (items) => {
        setInputValues((prev) => ({
            ...prev,
            toworkYear: '',
            toworkDay: '',
            toworkMonth: '',
        }))
        // console.log(inputs);
        setChecked(!checked);
        if (!checked) {
            items.map((item) => {
                return setInputValues({
                    ...inputValues,
                    [item]: '',
                });
            });
        }
    }

    // reportUpload 함수
    const uploadReport = async () => {
        if (window.confirm('내용 누락이 없는 지 확인 하셨나요?')) {
            if (window.confirm('보고서를 제출하시겠습니까?')) {
                alert('제출이 완료됐습니다.')

                let datas = {};

                if (toworkDay === undefined && toworkMonth === undefined && toworkYear === undefined) {
                    datas = {
                        toworkDay: day.toString(),
                        toworkMonth: month.toString(),
                        toworkYear: year.toString(),
                    }
                }

                console.log(reportType);
                const fetchOption = {
                    method: 'POST',
                    headers: {
                        'authorization': `Bearer ${getToken()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...inputValues, ...datas, reportType: reportType, userName: userInfo.userName }),
                };

                const response = await fetch('/content/uploadReport', fetchOption);

                if (response.status === 200) {
                    window.history.back();
                } else {
                    const result = await response.json();
                    alert(result.message);
                }
            }
        }

        /**
         const validateInputs = () => {
         const isValid = Object.values(inputValues).every((value) => value.trim() !== '');
         if (isValid) {
         alert('유효');
         } else {
         alert('무효');
         }
         }
         validateInputs();
          */
    }

    const dayReport = () => {
        return (
            <table>
                <tr>
                    <td colSpan={13}><h3>일 일 업 무 보 고 서</h3></td>
                </tr>
                <tr>
                    <td >
                        작성일
                    </td>
                    <td className="none"><input className="r_short_input" value={year} readOnly={true} /></td>
                    <td >년</td>
                    <td className="none"><input className="r_short_input" value={month} readOnly={true} /></td>
                    <td >월</td>
                    <td className="none"><input className="r_short_input" value={day} readOnly={true} /></td>
                    <td >일</td>
                    <td className="none"><input className="r_short_input" value={dayOfWeek} readOnly={true} /></td>
                    <td >요일</td>
                    <td rowSpan={3}>
                        결 재
                    </td>
                    <td>부 서 장</td>
                    <td>총 &nbsp; &nbsp;  무</td>
                    <td>사 &nbsp; &nbsp;  장</td>
                </tr>
                <tr style={{ height: '60px' }}>
                    <td style={{ height: '60px' }}>
                        업무명
                    </td>
                    <td colSpan={8} style={{ height: '60px' }}>
                        <div>
                            <input name="workingTitle" value={inputValues.workingTitle !== undefined ? inputValues.workingTitle : ''} onChange={(e) => handleInputValues(e)} maxLength={150} />
                        </div>
                    </td>
                    <td rowSpan={2}>
                    </td>
                    <td rowSpan={2}>
                    </td>
                    <td rowSpan={2}>
                    </td>
                </tr>
                <tr>
                    <td>
                        일 시
                    </td>
                    {checked ?
                        <>
                            <td className="none"><input name="toworkYear" value={inputValues.toworkYear !== undefined ? inputValues.toworkYear : ''} className="r_short_input" maxLength={4} onChange={(e) => handleInputValues(e)} /></td>
                            <td >년</td>
                            <td className="none"><input name="toworkMonth" value={inputValues.toworkMonth !== undefined ? inputValues.toworkMonth : ''} className="r_short_input" maxLength={2} onChange={(e) => handleInputValues(e)} /></td>
                            <td >월</td>
                            <td className="none"><input name="toworkDay" value={inputValues.toworkDay !== undefined ? inputValues.toworkDay : ''} className="r_short_input" maxLength={2} onChange={(e) => handleInputValues(e)} /></td>
                            <td >일</td>
                        </> :
                        <>
                            <td className="none"><input className="r_short_input" value={year} readOnly={true} /></td>
                            <td >년</td>
                            <td className="none"><input className="r_short_input" value={month} readOnly={true} /></td>
                            <td >월</td>
                            <td className="none"><input className="r_short_input" value={day} readOnly={true} /></td>
                            <td >일</td>
                        </>}
                    <td colSpan={2} className="none"> <label>작성일 사용 <button className=".btn .check" type="checkbox" checked={checked} onClick={() => handleCheckBox(["toworkYear", "toworkMonth", "toworkDay"])} style={{ height: '15px' }} /></label></td>
                </tr>
                <tr className="long_content">
                    <td className="long_content">
                        업 무 계 획
                    </td>
                    <td colSpan={12} className="long_content">
                        <div className="long_content">
                            <textarea name="plan" value={inputValues.plan !== undefined ? inputValues.plan : ''} onChange={(e) => handleInputValues(e)} maxLength={250} />
                            <p>{inputValues.plan !== undefined ? inputValues.plan.length : 0} / 250</p>
                        </div>
                    </td>
                </tr>
                <tr className="long_content">
                    <td className="long_content">
                        건 의 사 항
                    </td>
                    <td colSpan={12} className="long_content">
                        <div className="long_content">
                            <textarea name="claim" value={inputValues.claim !== undefined ? inputValues.claim : ''} onChange={(e) => handleInputValues(e)} maxLength={250} />
                            <p>{inputValues.claim !== undefined ? inputValues.claim.length : 0} / 250</p>
                        </div>
                    </td>
                </tr>
                <tr className="long_content">
                    <td className="long_content">
                        특 이 사 항
                    </td>
                    <td colSpan={12} className="long_content">
                        <div className="long_content">
                            <textarea name="etc" value={inputValues.etc !== undefined ? inputValues.etc : ''} onChange={(e) => handleInputValues(e)} maxLength={250} />
                            <p>{inputValues.etc !== undefined ? inputValues.etc.length : 0} / 250</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan={13} style={{ textAlign: 'right' }}>작성자 : {userInfo.userName}</td>
                </tr>
            </table>
        )
    }
    // console.log(inputValues);

    // 주간 보고서 요일별 특이사항 만들기
    const weekContents = () => {
        var rows = [];

        const makeRows = (day, month) => {
            for (let e = 0; e <= 4; e++) {
                rows.push(
                    <tr className="long_content">
                        <td>{month}/{parseInt(day) + e}</td>
                        <td className="long_content"><div><input name={`day${e}`} value={inputValues.day + e !== undefined ? inputValues.daye : ""} onChange={(e) => handleInputValues(e)} maxLength={1} style={{ textAlign: 'center' }} /></div></td>
                        <td className="long_content" colSpan={5}><div><textarea name={`plan${e}`} value={inputValues.plan + e !== undefined ? inputValues.plane : ""} onChange={(e) => handleInputValues(e)} maxLength={100} /></div></td>
                        <td className="long_content" colSpan={3}><div><textarea name={`claim${e}`} value={inputValues.claim + e !== undefined ? inputValues.claime : ""} onChange={(e) => handleInputValues(e)} maxLength={100} /></div></td>
                        <td className="long_content" colSpan={3}><div><textarea name={`etc${e}`} value={inputValues.etc + e !== undefined ? inputValues.exte : ""} onChange={(e) => handleInputValues(e)} maxLength={100} /></div></td>
                    </tr>
                )
            }
        }

        if (inputValues.toworkDay) {
            makeRows(inputValues.toworkDay, inputValues.toworkMonth);
        } else {
            makeRows(day, month);
        }
        return rows;
    }

    const weekReport = () => {
        return (
            <table>
                <tr>
                    <td colSpan={13}><h3>주 간 업 무 보 고 서</h3></td>
                </tr>
                <tr>
                    <td >
                        작성일
                    </td>
                    <td className="none"><input className="r_short_input" value={year} readOnly={true} /></td>
                    <td >년</td>
                    <td className="none"><input className="r_short_input" value={month} readOnly={true} /></td>
                    <td >월</td>
                    <td className="none"><input className="r_short_input" value={day} readOnly={true} /></td>
                    <td >일</td>
                    <td className="none"><input className="r_short_input" value={dayOfWeek} readOnly={true} /></td>
                    <td >요일</td>
                    <td rowSpan={3}>
                        결 재
                    </td>
                    <td>부 서 장</td>
                    <td>총 &nbsp; &nbsp;  무</td>
                    <td>사 &nbsp; &nbsp;  장</td>
                </tr>
                <tr style={{ height: '60px' }}>
                    <td style={{ height: '60px' }}>
                        주간 업무
                    </td>
                    <td colSpan={8} style={{ height: '60px' }}>
                        <div>
                            <input name="workingTitle" value={inputValues.workingTitle !== undefined ? inputValues.workingTitle : ''} onChange={(e) => handleInputValues(e)} maxLength={150} />
                        </div>
                    </td>
                    <td rowSpan={2}>
                    </td>
                    <td rowSpan={2}>
                    </td>
                    <td rowSpan={2}>
                    </td>
                </tr>
                <tr>
                    <td>
                        일 시
                    </td>
                    {checked ?
                        <>
                            <td className="none"><input name="toworkYear" value={inputValues.toworkYear !== undefined ? inputValues.toworkYear : ''} className="r_short_input" maxLength={4} onChange={(e) => handleInputValues(e)} /></td>
                            <td>년</td>
                            <td className="none"><input name="toworkMonth" value={inputValues.toworkMonth !== undefined ? inputValues.toworkMonth : ''} className="r_short_input" maxLength={2} onChange={(e) => handleInputValues(e)} /></td>
                            <td>월</td>
                            <td className="none"><input name="toworkDay" value={inputValues.toworkDay !== undefined ? inputValues.toworkDay : ''} className="r_short_input" maxLength={2} onChange={(e) => handleInputValues(e)} /></td>
                            <td>일~ {inputValues.toworkDay !== undefined && inputValues.toworkDay !== '' ?
                                (parseInt(inputValues.toworkDay) + 4 > lastDay ?
                                    parseInt(inputValues.toworkDay) + 4 - lastDay :
                                    parseInt(inputValues.toworkDay) + 4
                                ) :
                                ''}일</td>
                        </> :
                        <>
                            <td className="none"><input className="r_short_input" value={year} readOnly={true} /></td>
                            <td >년</td>
                            <td className="none"><input className="r_short_input" value={month} readOnly={true} /></td>
                            <td >월</td>
                            <td className="none"><input className="r_short_input" value={day} readOnly={true} /></td>
                            <td >일~{
                                parseInt(day) + 4 > lastDay
                                    ? parseInt(day) + 4 - lastDay
                                    : parseInt(day) + 4
                            }일</td>
                        </>}
                    <td colSpan={2} className="none"> <label>작성일 사용 <button className="" type="radio" defaultChecked={checked} onClick={() => handleCheckBox(["toworkYear", "toworkMonth", "toworkDay"])} style={{ height: '15px' }} /></label></td>
                </tr>
                <tr>
                    <td>날짜    </td>
                    <td>요일    </td>
                    <td colSpan={5}>업무내용</td>
                    <td colSpan={3}>건의사항</td>
                    <td colSpan={3}>특이사항</td>
                </tr>
                {weekContents()}
                <tr>
                    <td colSpan={13} style={{ textAlign: 'right' }}>작성자 : {userInfo.userName} </td>
                </tr>
            </table>
        )
    }

    return (
        <div id='reportWrapper'>
            <div className="button-wrapper">
                <label>업무 보고서 선택 &nbsp;
                    <select onChange={(e) => handleReportType(e.target.value)}>
                        <option value='1'>일일 업무보고서</option>
                        <option value='2'>주간 업무보고서</option>
                        <option value='3'>월간 업무보고서</option>
                    </select>
                </label>
            </div>
            {reportType === '1' ? dayReport() : reportType === '2' ? weekReport() : reportType === '3' ? null : null}
            <div className="button-wrapper">
                <button className="btn" onClick={() => exportWithExcel(day, month, year, dayOfWeek, inputValues, userInfo, reportType)}>엑셀로 내보내기</button>
                <button className="btn" onClick={uploadReport}>저장하기</button>
            </div>
        </div>
    )
}


