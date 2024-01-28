import express from 'express'
import db from '../models/index.js'
import { QueryTypes } from 'sequelize';


const corporationinfo = db.models.corporationinfo;
const userinfo = db.models.userinfo;
const projectmember = db.models.projectmember;
const projectinfo = db.models.projectinfo


const router = express.Router();

router.get('/getEmployee', async (req, res) => {
    let { offset, limit, name } = req.query;
    offset = parseInt(offset);
    limit = parseInt(limit);

    const company = req.corp;

    try {
        const response = await userinfo.findAll({
            attributes: ['user_name', 'user_authority', 'user_seq'],
            includes: {
                model: corporationinfo,
                as: 'corp_belongto_corporationinfo',
                where: { corp_name: company }
            }
        })
        res.status(200).json({ message: '사원 검색 성공', data: response });
    } catch (error) {
        res.status(500).json({ message: '사원 검색 실패', });
    }
})

router.post('/createProject', async (req, res) => {
    const { title, manager, objective, period, member } = req.body;
    const company = req.corp;

    console.log(title, manager, objective, period, member, company);

    const t = await db.sequelize.transaction();

    try {
        const companyRespose = await corporationinfo.findOne({ where: { corp_name: company } }, { transaction: t });
        const companySeq = companyRespose.corp_number;
        console.log(companySeq);
        const porjectResponse = await projectinfo.create({ pro_title: title, pro_manager: 'kkm9596', pro_objective: objective, pro_period: period }, { transaction: t })
        const projectSeq = porjectResponse.pro_seq
        member.map(async (e) => {
            const query = `INSERT INTO projectmember (pro_seq, user_seq) values (${projectSeq}, (SELECT user_seq from userinfo where user_name = '${e.user_name}'))`
            await projectmember.sequelize.query(query, { type: QueryTypes.INSERT }, { transaction: t });
        })
        t.commit();
    } catch (error) {
        console.log(error);
        t.rollback();
    }


})

export default router;