import { useEffect, useState } from "react"
import { getToken, handleInputValues } from "../../js/common";
import { disconnectSocket, initsocket, receiveMessage, sendMessage, socketClient } from "../../js/socket";
import { useCommonContext } from "../../provider/common";
export const Chat = () => {
    const { inputValues, setInputValues, userInfo } = useCommonContext();
    const token = getToken();

    // socket chatting 용 state
    const [socket, setSocket] = useState();

    const [messageRecived, setMessageRecived] = useState([]);

    const pressEnter = (e, cb) => {
        const key = e.code

        if (key === 'Enter' && e.nativeEvent.isComposing === false) {
            cb();
            setInputValues({
                message: '',
            });
        }

    }

    useEffect(() => {
        initsocket(userInfo);
        receiveMessage(setMessageRecived);
    }, []);

    const viewMessage = () => {
        return messageRecived.map((item, index) => (
            item.id === userInfo.userName ?
                <>
                    <span key={index} style={{ float: 'right' }} >{item.id} : {item.message}</span><br />
                </> :
                <>
                    <span key={index} style={{ float: 'left' }}>{item.id} : {item.message}</span><br />
                </>
        ));
    }

    return (
        <div>
            {viewMessage()}
            <input name="message" value={inputValues.message} onChange={(e) => handleInputValues(e, setInputValues)} onKeyDown={(e) => pressEnter(e, () => sendMessage(inputValues, userInfo.userName))} />
            <button onClick={disconnectSocket}>나가기</button>
            <button onClick={initsocket}>접속</button>
        </div>
    )

}