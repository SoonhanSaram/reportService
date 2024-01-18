import * as XLSX from 'xlsx-js-style';

// 엑셀로 내보내기 
export const exportWithExcel = async (day, month, year, dayOfWeek, inputValues, userInfo, reportType) => {
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