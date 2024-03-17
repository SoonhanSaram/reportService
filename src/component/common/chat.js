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

    const viewImage = () => {
        return messageRecived.map((item, index) => (
            item.id === userInfo.userName ?
                <>
                    <span className="inline_chat_right" key={index} >{item.id} : <img src={item.file} alt="image" /></span><br />
                </> :
                <>
                    <span className="inline_chat_left" key={index} >{item.id} : <img src={item.file} alt="image" /></span><br />
                </>
        ))
    }

    return (
        <div className="chat_background">
            <div className="chat_header"> {roomInfo.roomName} ({roomInfo.count ?? 0}명) </div>
            <div className="chat_box">
                {viewMessage()}
                {viewImage()}
            </div>
            <div className="chat_buttons">
                {/* inputValue 의 message 와  */}
                <input className="input_message" name="message" value={inputValues.message && !inputValues.image ? inputValues.message : !inputValues.message && inputValues.image ? inputValues.image : null} onChange={(e) => handleInputValues(e, setInputValues)} onKeyDown={(e) => pressEnter(e, () => sendMessage(inputValues, userInfo.userName))} />
                <button className='btn' onClick={() => sendMessage(inputValues, userInfo.userName)}>보내기</button>
                {/* button 모양의 input */}
                <input id='image-input' className="hidden" name='image' type="file" onChange={(e) => handleInputValues(e, setInputValues)}></input>
                <label className='btn' htmlFor='image-input'>이미지</label>
                {/* <button onClick={() => disconnectSocket()}>나가기</button> */}
                {/* <button onClick={() => initsocket(userInfo)}>접속</button> */}
            </div>
        </div>
    )

}