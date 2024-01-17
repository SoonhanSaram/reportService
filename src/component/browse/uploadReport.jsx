import { useEffect, useState } from "react"
import { useCommonContext } from "../../provider/common";
import * as XLSX from 'xlsx-js-style';

export const UploadReport = () => {

    const { userInfo, getToken } = useCommonContext();

    const [inputValues, setInputValues] = useState({
        toworkDay: undefined,
        toworkMonth: undefined,
        toworkYear: undefined,
        workingTitle: undefined,
    });

    const { toworkDay, toworkMonth, toworkYear, workingTitle, } = inputValues;

    const [currentTime, setCurrentTime] = useState(new Date());

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

        // console.log(inputValues);
    }

    // 엑셀로 내보내기 
    const exportWithExcel = async () => {
        const wb = XLSX.utils.book_new();
        let sheetName = '';
        let cols = [{ wch: 11 }]
        let merges;
        let rows;
        let datas = [];
        for (let i = 0; i <= 11; i++) {
            if (i % 2 === 0 && i <= 8) {
                cols.push({ wch: 16 })
            } else {
                cols.push({ wch: 8.5 })
            }

        };

        if (reportType === '1') {
            sheetName = '일 일 업 무 보 고 서'
            merges = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
                { s: { r: 2, c: 12 }, e: { r: 3, c: 12 } },
                { s: { r: 1, c: 9 }, e: { r: 3, c: 9 } },
                { s: { r: 2, c: 10 }, e: { r: 3, c: 10 } },
                { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } },
                { s: { r: 2, c: 1 }, e: { r: 2, c: 8 } },
                { s: { r: 3, c: 7 }, e: { r: 3, c: 8 } },
                { s: { r: 4, c: 1 }, e: { r: 4, c: 12 } },
                { s: { r: 5, c: 1 }, e: { r: 5, c: 12 } },
                { s: { r: 6, c: 1 }, e: { r: 6, c: 12 } },
                { s: { r: 7, c: 0 }, e: { r: 7, c: 12 } }
            ]

            rows = [
                { hpt: 48.75 },
                { hpt: 27 },
                { hpt: 27 },
                { hpt: 27 },
                { hpt: 150.75 },
                { hpt: 150.75 },
                { hpt: 150.75 },
                { hpt: 27 },
            ]
            datas = [
                [
                    { v: '업무명', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: inputValues.workingTitle, t: 's', s: { alignment: { horizontal: 'left', vertical: 'center' } } },
                ],
                [
                    { v: '일 시', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: year, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: '년', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: month, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: '월', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: day, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: '일', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } }
                ],
                [
                    { v: '업 무 계 획', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: inputValues.plan, t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'left', vertical: 'top' } } },
                ],
                [
                    { v: '건 의 사 항', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: inputValues.claim, t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'left', vertical: 'top' } } },
                ],
                [
                    { v: '특 이 사 항', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: inputValues.etc, t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'left', vertical: 'top' } } },
                ],
                [
                    { v: `작성자 : ${userInfo.userName}`, t: 's', s: { alignment: { horizontal: 'right' } } }
                ]
            ]
        } else if (reportType === '2') {
            sheetName = '주 간 업 무 보 고 서'
            const weeklyContent = async () => {
                const newMerges = [];
                for (let i = 4; i <= 9; i++) {
                    newMerges.push(
                        // { s: { r: i, c: 0 }, e: { r: i, c: 0 } },
                        // { s: { r: i, c: 1 }, e: { r: i, c: 1 } },
                        { s: { r: i, c: 2 }, e: { r: i, c: 6 } },
                        { s: { r: i, c: 7 }, e: { r: i, c: 9 } },
                        { s: { r: i, c: 10 }, e: { r: i, c: 12 } },
                    );
                }
                return newMerges;
            };

            const initialMergesmerges = [
                // 제목부분
                { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
                //  결재
                { s: { r: 1, c: 9 }, e: { r: 3, c: 9 } },
                //  상급자 사인부분
                { s: { r: 2, c: 10 }, e: { r: 3, c: 10 } },
                { s: { r: 2, c: 12 }, e: { r: 3, c: 12 } },
                { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } },
                // 업무 목표부분
                { s: { r: 2, c: 1 }, e: { r: 2, c: 8 } },

                { s: { r: 3, c: 7 }, e: { r: 3, c: 8 } },
                // 작성자 row
                { s: { r: 10, c: 0 }, e: { r: 10, c: 12 } },
            ];


            merges = [...initialMergesmerges, ...await weeklyContent()];

            rows = [
                { hpt: 48.75 },
                { hpt: 27 },
                { hpt: 27 },
                { hpt: 27 },
                { hpt: 27 },
                { hpt: 150.75 },
                { hpt: 150.75 },
                { hpt: 150.75 },
                { hpt: 150.75 },
                { hpt: 150.75 },
                { hpt: 27 },
            ];

            const initialData = [
                [
                    { v: '주간 업무', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: inputValues.workingTitle, t: 's', s: { alignment: { horizontal: 'left', vertical: 'center' } } },
                ],
                [
                    { v: '일 시', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: year, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: '년', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: month, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: '월', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: day, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: `일~ ${parseInt(day + 4)}일`, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                ],
                [
                    { v: '날짜', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: '요일', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    { v: '업무내용', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    {},
                    {},
                    {},
                    {},
                    { v: '건의사항', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                    {},
                    {},
                    { v: '특이사항', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                ],
            ];

            const dataOfDays = async (day, month) => {
                const tempDatas = [];
                for (let i = parseInt(day); i <= parseInt(day) + 4; i++) {
                    tempDatas.push(
                        [
                            { v: `${month}/${i}`, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                            { v: inputValues[`day${i}`] + i, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                            { v: inputValues[`plan${i}`] + i.toString(), t: 's', s: { alignment: { horizontal: 'left', vertical: 'top' } } },
                            {},
                            {},
                            {},
                            {},
                            { v: inputValues[`claim${i}`] + parseInt(i), t: 's', s: { alignment: { horizontal: 'left', vertical: 'top' } } },
                            {},
                            {},
                            { v: inputValues[`etc${i}`], t: 's', s: { alignment: { horizontal: 'left', vertical: 'top' } } },
                        ],
                    );
                };
                return tempDatas;
            };


            // datas = [...initialData]
            datas = [...initialData, ...await dataOfDays(day, month), [{ v: `작성자 : ${userInfo.userName}`, t: 's', s: { alignment: { horizontal: 'right' } } }]];

            // 누락된줄 알았던 데이터가 여기까지는 다 잘 들어가 있는 모습
            // console.log(datas);
        } else if (reportType === '3') {
            sheetName = '월간업무보고서'
        }

        const wsData = [
            [
                { v: sheetName, t: 's', s: { font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } } }
            ],
            [
                { v: '작성일', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: year, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: '년', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: month, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: '월', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: day, t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: '일', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: dayOfWeek, t: 's', s: { alignment: { horizontal: 'right', vertical: 'center' } } },
                { v: '요일', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: '결 재', t: 's', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: '부서장', t: 's', s: { alignment: { horizontal: 'center' } } },
                { v: '총  무', t: 's', s: { alignment: { horizontal: 'center' } } },
                { v: '사  장', t: 's', s: { alignment: { horizontal: 'center' } } }
            ],
        ];

        wsData.push(...datas);

        let ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!merges'] = merges;
        ws['!cols'] = cols;
        ws['!rows'] = rows;

        XLSX.utils.book_append_sheet(wb, ws, `${sheetName}`)
        XLSX.writeFile(wb, `./${sheetName}.xlsx`);
    };

    // 년/월/일/요일 로 date 값 변환
    const [date, setDate] = useState({
        year: '',
        month: '',
        day: '',
        dayOfWeek: '',
        lastDay: '',
    })

    // 구조분해
    const { year, month, day, dayOfWeek, lastDay } = date;

    useEffect(() => {
        setCurrentTime(new Date());

        const year = currentTime.getFullYear();
        const month = currentTime.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
        const day = currentTime.getDate();
        const dayOfWeek = getKoreanDayOfWeek(currentTime.getDay());
        const last = new Date(year, month, 0);

        // 요일을 한글로 반환
        function getKoreanDayOfWeek(dayIndex) {
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            return days[dayIndex];
        }

        setDate({
            year: year,
            month: month,
            day: day,
            dayOfWeek: dayOfWeek,
            lastDay: last.getDate(),
        })

        // console.log(inputValues);
    }, []);

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
                <button className="btn" onClick={exportWithExcel}>엑셀로 내보내기</button>
                <button className="btn" onClick={uploadReport}>저장하기</button>
            </div>
        </div>
    )
}


