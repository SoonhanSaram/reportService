import { io } from "socket.io-client";
import { getToken } from "./common";



export let socketClient = io('ws://localhost:3010', { transports: ['websocket'] });

export const initsocket = async () => {
    const token = getToken();
    const fetchOption = {
        method: 'POST',
        header: {
            'authorization': `Bearer ${token}`
        }
    }
    await fetch('/chat', fetchOption);

    if (socketClient) return;
    await socketClient.connect();
}

export const sendMessage = (input) => {
    if (socketClient === null || socketClient.connected === false) {
        initsocket();
    };

    socketClient.emit('msg', input.message);
}

export const receiveMessage = (setMessageRecived) => {


    socketClient.on('msg', async msg => {
        console.log(msg);
        if (msg) setMessageRecived(prev => [...prev, msg]);
        else return;
    })
}

export const disconnectSocket = () => {
    if (socketClient === null || socketClient.connected === false) {
        return;
    }

    socketClient.disconnect();
    socketClient = undefined;
}