// reportCommon.js

import { getToken } from "./common";

// 제출한 date 를 변환하는 함수
export function formatDate(date) {
    const formedDate = date.slice(0, 10);
    return formedDate;
}

export function formatStatus(approvalStatus) {
    const status = ["검토 중", "최종 승인 요청", "반려", "진행중", "완료", "미흡"];
    return status[parseInt(approvalStatus)];
}

export function formatReportType(reportType) {
    const type = ['일일업무보고서', '주간업무보고서'];
    const typeNum = parseInt(reportType) - 1;
    return type[typeNum];
}
