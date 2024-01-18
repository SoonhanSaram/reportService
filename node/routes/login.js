// 로그인을 위한 API
import express from 'express';
// jwt service import
import { issueAccessToken, verifyToken, verifyRefreshToken, issueRefreshToken, } from '../module/controljwt.js'
import { redisClient } from '../module/redis.js'
// import db
import db from "../models/index.js"
import { encryptModule } from '../module/crypto.js';

const corpInfo = db.models.corporationinfo;
const userInfo = db.models.userinfo;

const router = express.Router();

// 유저 로그인을 위한 라우터 
router.post('/', async (req, res, next) => {
    const { uName, uPassword } = req.body
    const hashedPassword = encryptModule(uPassword);
    try {
        const response = await userInfo.findOne({ attributes: ['user_name', 'user_authority', 'corp_belongto'] }, { where: { user_name: uName, user_password: hashedPassword } });
        const corporation = await corpInfo.findOne({ where: { corp_number: response.corp_belongto } })

        // console.log('체크1');
        const accessToken = issueAccessToken(response.user_name, response.user_authority, corporation.corp_name);

        // console.log('토큰 발급', accessToken);

        // console.log('체크2');
        const refreshToken = issueRefreshToken();
        // console.log('체크3');
        await redisClient.connect()
        // console.log('체크4');
        await redisClient.set(response.user_name, refreshToken);
        // console.log('체크5');
        await redisClient.disconnect();

        res.cookie("refreshtoken", refreshToken, { expires: new Date(Date.now() + 900000), httpOnly: true, secure: true }).status(200).send({ message: "로그인 성공", data: { accesstoken: accessToken } });
    } catch (error) {
        res.status(401).send("로그인 실패")
    }
})

router.post('/logout', async (req, res, next) => {
    const { uName } = req.body;

    console.log(uName);

    // log 남길 공간

    try {
        await redisClient.connect();
        const keyExists = await redisClient.exists(uName);
        // redis 에서 삭제
        await redisClient.del(uName);
        await redisClient.disconnect();

        res.status(200).send({ message: '로그아웃 성공' })
    } catch (error) {
        res.status(401).send({ message: '로그아웃 실패' })
    }
})

export default router 