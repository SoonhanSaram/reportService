import express from 'express';
import { io } from '../bin/www.js';
const router = express.Router();
const enterSocket = async (ioInstance, id) => {

    ioInstance.on('ping', (ping) => {
        if (ping) {
            socket.emit('pong', true)
        }
        else {
            socket.emit('pong', false);
            return;
        }
    });

    ioInstance.on('connection', async (socket) => {
        // console.log('connect 소켓', socket);
        socket.join('해피투게더');
        console.log('접속 해피투게더');
        socket.on('msg', (msg) => {
            socket.emit('msg', msg);
        });
    });

    ioInstance.on("disconnect", async (reason) => {
        console.log('연결 해제', socket);
    });

    ioInstance.emit('msg', 'world')

}



// 1. jwt 로 회원 정보 가져와서 회원 아이디 회사 아이디 구분 || 완료
// 2. websocket 을 통해서 binary 전송(파일) 

router.post('/', async (req, res) => {
    const id = { name: req.name, role: req.role, corporation: req.corp };
    let sockets = {};
    const { sids, rooms } = io.sockets.adapter;
    const countPeople = (roomName) => rooms.get(roomName).size;

    io.on('connection', (socket) => {
        const socketId = socket.id;

        console.log(sockets);
        // console.log('connect 소켓', socket);
        if (sockets[socketId]) {
            // 중복된 socketId가 존재한다면 기존에 존재하는 소켓을 disconnect 시키는 함수를 만들어줘야 한다.
            socket.disconnect();
        } else {
            sockets[socketId] = socket;
        }


        socket.on('joinRoom', () => {
            socket.join(id.corporation);
            console.log(`${id.name}`);
            const count = countPeople(id.corporation);
            io.to(id.corporation).emit('msg', `${id.name}님이 입장하셨습니다., ${count}명이 접속중입니다.`);
        });

        socket.on('msg', (msg) => {
            msg === '' || null ? null : io.to(id.corporation).emit('msg', msg);
            console.log(msg);
        });

        socket.on('leaveRoom', (room) => {
            socket.leave(id.corporation);
            io.to(`${id.corporation}`).emit('msg', `${id.name}님이 퇴장하셨습니다.`);
        });
    })

    // test
    // await enterSocket(socketIo, id)

    res.status(200).send({ message: '연결완료' });
    // admin

    // 같은 기업에서 owner/leader

    // 프로젝트 팀 단위



})

export default router;