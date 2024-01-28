import { useEffect, useState } from "react"
import { getToken, handleInputValues } from "../../js/common";
import { disconnectSocket, initsocket, receiveMessage, sendMessage, socketClient } from "../../js/socket";
import { useCommonContext } from "../../provider/common";
export const Chat = () => {
    const { inputValues, setInputValues } = useCommonContext();
    const token = getToken();

    // socket chatting 용 state
    const [socket, setSocket] = useState();

    const [messageRecived, setMessageRecived] = useState([]);

    const pressEnter = (e, cb) => {
        const key = e.code

        if (key === 'Enter' && e.nativeEvent.isComposing === false) {
            cb();
            setInputValues({});
        }

    }

    useEffect(() => {
        return socketClient.on('msg', msg => {
            const newMsg = msg;
            if (newMsg) setMessageRecived(prev => [...prev, newMsg]);
            else return;
        })
    }, []);

    const viewMessage = () => {
        return messageRecived.map((item, index) => (
            <><span key={index}>{item}</span><br /></>
        ));
    }

    return (
        <div>
            {viewMessage()}
            <input name="message" value={inputValues.message} onChange={(e) => handleInputValues(e, setInputValues)} onKeyDown={(e) => pressEnter(e, () => sendMessage(inputValues))} />
            <button onClick={disconnectSocket}>나가기</button>
            <button onClick={initsocket}>접속</button>
        </div>
    )

}