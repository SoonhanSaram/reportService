import { useCommonContext } from "../../provider/common";

export const WeeklyReport = (props) => {

    const { index, startDate, endDate, inputValues, handleInputValues } = props;

    const { userInfo, date, dailyReportList } = useCommonContext();

    const { year, month, day, dayOfWeek, lastDay } = date;

    console.log(year, month, day, dayOfWeek, lastDay)

    // 주간 보고서 요일별 특이사항 만들기
    const weekContents = (day, month) => {
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
                rows.push(
                    <tr className="long_content">
                        <td>{month}/{parseInt(day) + e}</td>
                        <td className="long_content"><div><input name={`day${e}`} value={inputValues.day + e !== undefined ? inputValues.daye : ""} onChange={(e) => handleInputValues(e)} maxLength={1} style={{ textAlign: 'center' }} /></div></td>
                        {/* <td className="long_content" colSpan={5}><div><textarea name={`plan${e}`} value={inputValues.plan + e !== undefined ? inputValues.plane : ""} onChange={(e) => handleInputValues(e)} maxLength={100} /></div></td> */}
                        {/* <td className="long_content" colSpan={3}><div><textarea name={`claim${e}`}value={inputValues.claim + e !== undefined ? inputValues.claime : ""} onChange={(e) => handleInputValues(e)} maxLength={100} /></div></td> */}
                        {/* <td className="long_content" colSpan={3}><div><textarea name={`etc${e}`} value={inputValues.etc + e !== undefined ? inputValues.exte : ""} onChange={(e) => handleInputValues(e)} maxLength={100} /></div></td> */}
                    </tr>
                )

            };
        };

        // if (inputValues.toworkDay) {
        // makeRows(inputValues.toworkDay, inputValues.toworkMonth);
        // } else {
        // makeRows(day, month);
        // }
        makeRows(day, month);

        return rows;
    }

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
                        <input name="workingTitle" value={workingTitle} maxLength={150} readOnly={true} />
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
                <td colSpan={2} className="none"></td>
            </tr>
            <tr>
                <td>날짜    </td>
                <td>요일    </td>
                <td colSpan={5}>업무내용</td>
                <td colSpan={3}>건의사항</td>
                <td colSpan={3}>특이사항</td>
            </tr>
            {weekContents(day, month)}
            <tr>
                <td colSpan={13} style={{ textAlign: 'right' }}>작성자 : {userInfo.userName} </td>
            </tr>
        </table>
    )
}