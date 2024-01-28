import express from 'express';
import { io } from '../bin/www.js';

const router = express.Router();

const enterSocket = (ioInstance, socket) => {
    console.log('체크 11');

    ioInstance.on('connection', async (socket) => {
        await socket.join('해피투게더')
        console.log('접속 해피투게더');
        await socket.on('msg', (msg) => {
            socket.emit('msg', msg);
        });
    });

    ioInstance.on("disconnect", (reason) => {
        console.log(reason);
    });

    ioInstance.emit('msg', 'world')

}

router.post('/', async (req, res) => {
    console.log('check 1');

    // test
    enterSocket(io, 'vvvvvvvvv')

    // admin

    // 같은 기업에서 owner/leader

    // 프로젝트 팀 단위



})

export default router;