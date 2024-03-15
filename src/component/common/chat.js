import { useEffect, useState } from "react"
import { getToken, handleInputValues } from "../../js/common";
import { disconnectSocket, initsocket, receiveMessage, sendMessage, socketClient } from "../../js/socket";
import { useCommonContext } from "../../provider/common";
import '../../css/chat.css'
export const Chat = () => {
    const { inputValues, setInputValues, userInfo } = useCommonContext();
    const token = getToken();

    // socket chatting 용 state
    const [socket, setSocket] = useState(null);

    const [messageRecived, setMessageRecived] = useState([]);
    const [roomInfo, setRoomInfo] = useState({});
    console.log(roomInfo);

    const pressEnter = (e, cb) => {
        const key = e.code
        if ((key === 'Enter' || key === 'NumpadEnter') && e.nativeEvent.isComposing === false) {
            cb();
            setInputValues({
                message: '',
            });
        }

    }

    useEffect(() => {
        if (socketClient === null || socketClient?.connected === false) {
            initsocket(userInfo, setSocket);
        }
        receiveMessage(setMessageRecived, setRoomInfo);

        // unmount 시 socket disconnect
        return () => {
            disconnectSocket(setSocket);
        }
    }, []);

    /**
        useEffect(() => {
            if (!socket) {
                const setSocket = async () => {
                    setSocket(io('ws://localhost:3010', { query: { id: userInfo.userName, authority: userInfo.userAuthority, belongto: userInfo.userBelongto } }))
                    await initsocket(socket);
                }
                setSocket();
            } else receiveMessage(setMessageRecived, socket);
        }, []);
    */
    const viewMessage = () => {
        return messageRecived.map((item, index) => (
            item.id === userInfo.userName ?
                <>
                    <span className="inline_chat_right" key={index} >{item.id} : {item.message}</span><br />
                </> :
                item.id === null ?
                    <>
                        <span className="inline_chat_center" key={index}  >-----{item.message}-----</span><br />
                    </> :
                    <>
                        <span className="inline_chat_left" key={index} >{item.id} : {item.message}</span><br />
                    </>
        ))
    }

    return (
        <div className="chat_background">
            <div className="chat_header"> {roomInfo.roomName} ({roomInfo.count ?? 0}명) </div>
            <div className="chat_box">
                {viewMessage()}
            </div>
            <div className="chat_buttons">
                <input className="input_message" name="message" value={inputValues.message} onChange={(e) => handleInputValues(e, setInputValues)} onKeyDown={(e) => pressEnter(e, () => sendMessage(inputValues, userInfo.userName))} />
                <button className='btn' onClick={() => sendMessage(inputValues, userInfo.userName)}>보내기</button>
                {/* <button onClick={() => disconnectSocket()}>나가기</button> */}
                {/* <button onClick={() => initsocket(userInfo)}>접속</button> */}
            </div>
        </div>
    )

}