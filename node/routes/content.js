import express from 'express'
import db from "../models/index.js"
import { Op, QueryTypes } from 'sequelize';

const reportCommon = db.models.reportcommon;
const daily = db.models.dailyreports;
const weekly = db.models.weeklyreports;

const router = express.Router();
/***********************
 진행상황 정의
 (제출) 0 : 검토 중, (부서장 승인 후) 1 : 최종 승인 요청, 
  3 : 반려, 4 : (최종 승인 후) 진행중, 5 : 완료, 6 : 미흡)
 ***********************/


router.get('/getReports', async (req, res) => {
    let { offset, limit } = req.query;
    offset = parseInt(offset);
    limit = parseInt(limit);
    const author = req.name;

    try {
        /**
        const reports = await daily.findAll({
        include: [{
        model: reportCommon,
        as: 'reportcommon',
        where: { author: { [Op.like]: "%" + author + "%" } },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }, // 필요에 따라 기본 속성 제외 설정
        }],
        benchmark: true,
        raw: true,
        offset: offset,
        limit: limit,
        },); //3ms
         */

        /**
        const reports = await reportCommon.findAll({
            where: { author: { [Op.like]: "%" + author + "%" } },
            // include: [{
            // model: 'dailyreports',
            // attributes: ['work_date', 'work_plan', 'suggestions', 'unique_points'],
            // }],
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }, // 필요에 따라 기본 속성 제외 설정
            benchmark: true,
            offset: offset,
            limit: limit,
        },); //32ms
        */

        // const query = `SELECT a.*, b.work_date, b.work_plan, b.suggestions, b.unique_points from (SELECT * from reportscommon where author like ${author}) a  join dailyreports b on a.report_seq = b.report_seq` // 9ms

        const count = await reportCommon.count({ where: { author: author } });

        // console.log(count);

        const query = `SELECT a.*, b.work_date, b.work_plan, b.suggestions, b.unique_points from (SELECT * from reportscommon where author = '${author}' limit ${offset}, ${limit}) a  join dailyreports b on a.report_seq = b.report_seq` // 2ms

        const reports = await reportCommon.sequelize.query(query, { type: QueryTypes.SELECT, benchmark: true });
        console.log(reports);


        res.status(200).send({ message: '보고서 리스트 가져오기 성공', list: reports, count: count });
    } catch (error) {
        res.status(401).send({ message: '보고서 리스트 가져오기 실패' });
    }

})

router.post('/uploadReport', async (req, res) => {
    //  트랜잭션 사용
    const t = await db.sequelize.transaction();

    const { reportType, toworkDay, toworkMonth, toworkYear, workingTitle, userName } = req.body;
    const startDate = new Date(toworkYear, parseInt(toworkMonth, 10) - 1, toworkDay, 9);

    const commonResponse = await reportCommon.create({ author: userName, approval_status: '0', objectives: workingTitle, report_type: reportType }, { transaction: t });
    if (reportType === '1') {
        const { plan, claim, etc } = req.body;
        try {
            // console.log(commonResponse);
            await daily.create({ report_seq: commonResponse.report_seq, work_date: startDate, work_plan: plan, suggestions: claim, unique_points: etc }, { transaction: t });
            await t.commit();
            res.status(200).send({ message: '일일업무보고서 작성 완료' });
        } catch (error) {
            await t.rollback()
            res.status(401).send({ message: '일일업무보고서 작성 실패' });
        }
    } else if (reportType === '2') {
        const { plan0, claim0, etc0, plan1, claim1, etc1, plan2, claim2, etc2, plan3, claim3, etc3, plan4, claim4, etc4, } = req.body
        const endDate = new Date(toworkYear, parseInt(toworkMonth, 10) - 1, toworkDay + 4, 9) // 업무 완료일 설정
        try {
            // console.log(commonResponse.report_seq, startDate, endDate);
            // sequelize 로깅 logging: (...msg) => console.log(msg) 
            await weekly.create(
                {
                    report_seq: commonResponse.report_seq,
                    start_date: startDate,
                    end_date: endDate,
                    day1_plan: plan0,
                    day1_suggestions: claim0,
                    day1_unique_points: etc0,
                    day2_plan: plan1,
                    day2_suggestions: claim1,
                    day2_unique_points: etc1,
                    day3_plan: plan2,
                    day3_suggestions: claim2,
                    day3_unique_points: etc2,
                    day4_plan: plan3,
                    day4_suggestions: claim3,
                    day4_unique_points: etc3,
                    day5_plan: plan4,
                    day5_suggestions: claim4,
                    day5_unique_points: etc4,
                },
                { transaction: t }
            );
            await t.commit();
            res.status(200).send({ message: '주간업무보고서 작성 완료' })
        } catch (error) {
            await t.rollback()
            res.status(401).send({ message: '주간업무보고서 작성 실패' });
        }
    }
})

export default router;