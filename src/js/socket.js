import { io, Manager } from "socket.io-client";
import { getToken } from "./common";


let manager = new Manager('ws://localhost:3010', {
    transports: ['websocket'], autoConnect: false, query: {
        id: null,
        authority: null,
        belongto: null,
    }
});

export let socketClient = null;

export const initsocket = async (userInfo) => {
    const { userName, userAuthority, userBelongto } = userInfo;
    console.log(userName, userAuthority, userBelongto);

    manager = new Manager('ws://localhost:3010', {
        transports: ['websocket'], autoConnect: false, query: {
            id: userName,
            authority: userAuthority,
            belongto: userBelongto,
        }
    });

    if (socketClient === null || socketClient?.connected === false) {

        socketClient = manager.socket('/');
        console.log(socketClient);

        // const fetchOption = {
        //     method: 'POST',
        //     headers: {
        //         'authorization': `Bearer ${token}`
        //     }
        // }
        // const response = await fetch('/chat', fetchOption);
        // const result = await response.json();

        // socket 에 연결할 때 client 정보를 넘기고 싶어서 아래와 같이 넘겨줌


        socketClient.connect();

        socketClient.emit('joinRoom');

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
    console.log(input.message, id, 'socket', socketClient);

    // image 파일 전송
    if (input.image && socketClient !== undefined && socketClient?.connected === true) {
        const file = input.file;
        socketClient.emit('msg', { message: input.message, id: id, file: file });
    } else {
        input.message == '' || null ? alert('메시지를 입력해주세요') : socketClient.emit('msg', { message: input.message, id: id })
    }
}



export const receiveMessage = (setMessageRecived, setRoomInfo) => {

    socketClient.on('infos', async (infos) => {
        if (infos) setRoomInfo(infos);
        else return;
    });

    socketClient.on('image', async (image) => {
        if (image) setMessageRecived(prev => [...prev, image]);
        else return;
    });

    socketClient.on('msg', async msg => {
        console.log(msg);
        if (msg) setMessageRecived(prev => [...prev, msg]);
        else return;
    })

}

export const disconnectSocket = (setSocket) => {

    if (socketClient === undefined || socketClient?.connected === false) {
        return;
    }
    socketClient.disconnect();

    setSocket(null);
}