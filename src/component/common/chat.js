import { useEffect, useState } from "react"
import { getToken, handleDrop, handleInputValues } from "../../js/common";
import { disconnectSocket, initsocket, receiveMessage, sendMessage, socketClient } from "../../js/socket";
import { useCommonContext } from "../../provider/common";
import '../../css/chat.css'
export const Chat = () => {
    const { inputValues, setInputValues, userInfo } = useCommonContext();
    const token = getToken();

    // socket chatting 용 state
    const [socket, setSocket] = useState(null);
    const [daragOver, setDragOver] = useState(false);
    const [messageRecived, setMessageRecived] = useState([]);
    const [roomInfo, setRoomInfo] = useState({});

    const pressEnter = (e, cb) => {
        // inputValue 초기화
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

    useEffect(() => {
        if (inputValues.file) {
            sendMessage(inputValues, userInfo.userName, setInputValues)
        }
    }, [inputValues.file]);

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
            // item 에 message 만 있는 경우, item.image 만 있는 경우, 둘 다 있는 경우
            item.id === userInfo.userName ?
                <>
                    {item.file ? <div className="inline_chat_right_wrapper" key={index} >
                        <span className="inline_chat_right_name" key={index} > {item.id} </span><br /><img className="inline_image" src={item.file} alt="image" /></div> :
                        <span className="inline_chat_right_name" key={index} >{item.id} </span>}
                    <div className="inline_chat_right_message">{item.message}</div>
                    <br />
                </> :
                item.id === null ?
                    <>
                        <span className="inline_chat_center" key={index}  >{item.message}</span><br />
                    </> :
                    <>
                        {item.file ? <span className="inline_chat_left_wraaper" key={index} >{item.id} : <img className="inline_image" src={item.file} alt="image" /></span> :
                            <span className="inline_chat_left_name" key={index} >{item.id}</span>}
                        <div className="inline_chat_left_message">{item.message}</div>
                        <br />
                    </>
        ))
    }

    return (
        <div className="chat_background" onDragEnter={(e) => e.preventDefault()} onDragLeave={(e) => e.preventDefault()}>
            <div className="chat_header"> {roomInfo.roomName} ({roomInfo.count ?? 0}명) </div>
            {/* drag 가 시작되면 setDragOver 는 true, drag 위치를 벗어나거나, drop 을 했을 때, setDragOver 가 false 가 되도록 함 */}

            <div className="chat_box" onDragEnter={() => setDragOver(true)} onDragLeave={() => setDragOver(false)} onDrop={(e) => (setDragOver(false), handleDrop(e, setInputValues, setDragOver))} onDragOver={(e) => (handleDrop(e, setInputValues, setDragOver))}>
                {daragOver === true ? <div className="drag_over">사진을 드롭하세요</div> : viewMessage()}
            </div>
            <div className="chat_buttons">
                {/* inputValue 의 message 와  */}
                <input className="input_message" name="message" value={inputValues.message} onChange={(e) => handleInputValues(e, setInputValues)} onKeyDown={(e) => pressEnter(e, () => sendMessage(inputValues, userInfo.userName))} />
                <button className='btn' onClick={() => sendMessage(inputValues, userInfo.userName)}>보내기</button>
                {/* button 모양의 input */}
                <input id='image-input' className="hidden" name='image' type="file" onChange={(e) => (handleInputValues(e, setInputValues))}></input>
                <label className='btn' htmlFor='image-input'>이미지</label>
                {/* <button onClick={() => disconnectSocket()}>나가기</button> */}
                {/* <button onClick={() => initsocket(userInfo)}>접속</button> */}
            </div>
        </div>
    )

}