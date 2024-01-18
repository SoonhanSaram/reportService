import { useEffect, useState } from "react";
import { useCommonContext } from "../../provider/common";

export const DailyReport = ({ index }) => {

    const { userInfo, date, dailyReportList, handleInputValues, inputValues } = useCommonContext();

    const { year, month, day, dayOfWeek, lastDay } = date;

    const [report, setReport] = useState(dailyReportList[index])

    useEffect(() => {
        setReport(dailyReportList[index]);
    }, [index])

    const viewReport = (values, readOnly) => {
        const workdate = new Date(values.work_date);
        const workYear = workdate.getFullYear();
        const workMonth = workdate.getMonth() + 1;
        const workday = workdate.getDate();
        return (
            < table >
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
                            <input name="objectives" value={values.objectives !== undefined ? values.objectives : ''} onChange={(e) => handleInputValues(e)} maxLength={150} readOnly={readOnly} />
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
                    <td className="none"><input className="r_short_input" value={workYear} readOnly={readOnly} /></td>
                    <td >년</td>
                    <td className="none"><input className="r_short_input" value={workMonth} readOnly={readOnly} /></td>
                    <td >월</td>
                    <td className="none"><input className="r_short_input" value={workday} readOnly={readOnly} /></td>
                    <td >일</td>
                    <td colSpan={2} className="none"></td>
                </tr>
                <tr className="long_content">
                    <td className="long_content">
                        업 무 계 획
                    </td>
                    <td colSpan={12} className="long_content">
                        <div className="long_content">
                            <textarea name="work_plan" value={values.work_plan !== undefined ? values.work_plan : ''} onChange={(e) => handleInputValues(e)} maxLength={250} readOnly={readOnly} />
                            <p>{values.work_plan !== undefined ? values.work_plan.length : 0} / 250</p>
                        </div>
                    </td>
                </tr>
                <tr className="long_content">
                    <td className="long_content">
                        건 의 사 항
                    </td>
                    <td colSpan={12} className="long_content">
                        <div className="long_content">
                            <textarea name="suggestions" value={values.suggestions !== undefined ? values.suggestions : ''} onChange={(e) => handleInputValues(e)} maxLength={250} readOnly={readOnly} />
                            <p>{values.suggestions !== undefined ? values.suggestions.length : 0} / 250</p>
                        </div>
                    </td>
                </tr>
                <tr className="long_content">
                    <td className="long_content">
                        특 이 사 항
                    </td>
                    <td colSpan={12} className="long_content">
                        <div className="long_content">
                            <textarea name="unique_points" value={values.unique_points !== undefined ? values.unique_points : ''} onChange={(e) => handleInputValues(e)} maxLength={250} readOnly={readOnly} />
                            <p>{values.unique_points !== undefined ? values.unique_points.length : 0} / 250</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan={13} style={{ textAlign: 'right' }}>작성자 : {values.author}</td>
                </tr>
            </table >
        );
    }


    return (
        <>
            {index ? viewReport(report, false) : viewReport(report, false)}
        </>

    )
}