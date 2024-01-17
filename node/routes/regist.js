// 회원가입을 위한 API
import express from 'express'
// .env 를 사용하기 위해서 dotenv 모듈 사용
import dotenv from 'dotenv'
// root 폴더에 .env 파일이 있다면 dotenv.config() 로 초기화
dotenv.config();

import db from "../models/index.js"
import { Op } from 'sequelize';
import { encryptModule } from '../module/crypto.js';


const corpInfo = db.models.corporationinfo;
const userInfo = db.models.userinfo;

// 라우터 초기화
const router = express.Router();

// 사업자 번호 사용가능 확인
router.post('/validate', async (req, res, next) => {
    const { b_no } = req.body;
    /* 공공데이터를 활용한 사업자번호 상태 확인    
    console.log(b_no + "api 주소 : " + process.env.CORPORATION_NUMBER_API + " 서비스 키 :" + process.env.CORPORATION_NUMBER_API_SERVICEKEY);
    const fetchOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "b_no": b_no,
        })
    }
    const response = await fetch(`${process.env.CORPORATION_NUMBER_API}${process.env.CORPORATION_NUMBER_API_SERVICEKEY}`, fetchOption);
    console.log(response);
    */

    try {
        const response = await corpInfo.findOne({ where: { corp_number: b_no } });
        res.status(200).json(response);
    } catch (error) {
        res.status(403).end()
    }
})

// 사업자 아이디 중복 확인
router.post('/validateAdmin', async (req, res, next) => {
    const { uName } = req.body;
    try {
        const response = await userInfo.findOne({ where: { user_name: uName } });
        res.status(200).json(response);
    } catch (error) {
        res.status(403).end()
    }
})

// 기업 회원가입
router.post('/corporation', async (req, res, next) => {
    const corpCategory = "IT서비스"
    const { corNumber, corName, corTel, uName, uPassword } = req.body;
    console.log(corNumber, corName, corTel, uName, uPassword);
    const hashedPassword = encryptModule(uPassword);

    const t = await db.sequelize.transaction()

    try {
        console.log('체크 0');
        // 여러개의 table 을 사용하므로 트랜잭션 사용
        const CorporationResponse = await corpInfo.create({ corp_number: corNumber, corp_name: corName, corp_tel: corTel, corp_category: corpCategory }, { transaction: t })
        console.log('체크 1');
        const AdminResponse = await userInfo.create({ user_name: uName, user_password: hashedPassword, user_authority: 1, corp_belongto: corNumber }, { transaction: t })
        console.log('체크 2');

        // 에러 없이 실행이 되면 transaction commit 
        await t.commit();

        // statusmessage 설정 하고 response 전달
        res.status(200).send("회원가입이 완료되었습니다.");

    } catch (error) {
        await t.rollback();
        res.status(500).send("기업 회원가입 중 오류가 발생했습니다.");
    }
})

// 유저 아이디 중복확인
router.post('/validateUser', async (req, res, next) => {
    const { userName } = req.body

    try {
        const response = await userInfo.findOne({ where: { user_name: userName } });
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).end();
    }
})

// 기업 리스트 가져오기
router.get('/corporationList/:corpName', async (req, res, next) => {
    console.log('기업 리스트 가져오기 API 확인');

    const corpName = req.params.corpName;
    try {
        const response = await corpInfo.findAll({ where: { corp_name: { [Op.like]: "%" + corpName + "%" } } });
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).end();
    }
})

// 유저 회원가입 
router.post('/user', async (req, res, next) => {
    const { uName, uPassword, uCorporation } = req.body;
    // console.log(uName, uPassword, uCorporation);

    // 요청받은 비밀번호를 암호화 
    const hashedPassword = encryptModule(uPassword);
    console.log(hashedPassword);

    try {
        const response = await userInfo.create({ user_name: uName, user_password: hashedPassword, corp_belongto: uCorporation });
        console.log(response);
        // statusmessage 설정 하고 response 전달
        res.status(200).send("회원가입이 완료되었습니다.");
    } catch (error) {
        res.status(403).send("회원가입 중 오류가 발생했습니다.");
    }
})
export default router;