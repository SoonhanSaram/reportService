import express from 'express';
import { io } from '../bin/www.js';
const router = express.Router();

// 1. jwt 로 회원 정보 가져와서 회원 아이디 회사 아이디 구분 || 완료
// 2. websocket 을 통해서 binary 전송(파일) 

router.post('/', async (req, res) => {
    const id = { name: req.name, role: req.role, corporation: req.corp };
    const { sids, rooms } = io.sockets.adapter;
    const countPeople = (roomName) => rooms.get(roomName).size;



    // test
    // await enterSocket(socketIo, id)

    res.status(200).send({ message: '연결완료' });
    // admin

    // 같은 기업에서 owner/leader

    // 프로젝트 팀 단위



})

export default router;