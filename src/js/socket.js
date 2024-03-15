import { io, Manager } from "socket.io-client";
import { getToken } from "./common";


const manager = new Manager('ws://localhost:3010', { transports: ['websocket'], autoConnect: false });

export let socketClient = manager.socket('/');

export const initsocket = async (userInfo) => {
    const { userName, userAuthority, userBelongto, isLogin } = userInfo;

    if (socketClient === undefined || socketClient?.connected === false) {
        const token = getToken();

        // const fetchOption = {
        //     method: 'POST',
        //     headers: {
        //         'authorization': `Bearer ${token}`
        //     }
        // }
        // const response = await fetch('/chat', fetchOption);
        // const result = await response.json();

        // socket 에 연결할 때 client 정보를 넘기고 싶어서 아래와 같이 넘겨줌
        socketClient.connect({ id: userName, authority: userAuthority, belongto: userBelongto });


        socketClient.emit('joinRoom', { room: '1번프로젝트입니다.' })

        // console.log('핑 던지기 ');
        // 
        // socketClient.emit('ping', true);
        // 
        // console.log('퐁 받기');
        // 
        // socketClient.on('pong', (pong) => {
        // pong ? pingPong = true : pingPong = false;
        // })



        /**
        setTimeout(async () => {
            pingPong = await ping(socketClient)
        }, 100)
    
        if (pingPong) {
            return alert(result.message);
        } else {
            socketClient.disconnect();
            return alert('서버연결 실패');
        }
         */
        /** 
        socketClient.on('msg');
        if (socketClient) return;
        */
    }
}


const ping = async (socketClient) => {
    console.log('핑퐁 시도');

    await socketClient.emit('ping', true);

    await socketClient.on('pong', (pong) => {
        return pong ? true : false
    })
}

export const sendMessage = (input, id) => {
    // if (socketClient === null || socketClient.connected === false) {
    //     initsocket();
    // };    
    // socketClient === null || socketClient?.connected === false ? alert('접속되지 않았습니다.') : input.message == '' || null ? alert('메시지를 입력해주세요') : socketClient.emit('msg', { message: input.message, id: id });


    if (socketClient !== undefined && socketClient?.connected === true) {
        input.message == '' || null ? alert('메시지를 입력해주세요') : socketClient.emit('msg', { message: input.message, id: id })
    }
}



export const receiveMessage = (setMessageRecived) => {

    socketClient.on('msg', async msg => {
        console.log(msg);
        if (msg) setMessageRecived(prev => [...prev, msg]);
        else return;
    })

}

export const disconnectSocket = () => {

    if (socketClient === undefined || socketClient?.connected === false) {
        return;
    }
    socketClient.disconnect();

    socketClient = undefined;

    console.log(socketClient);

}