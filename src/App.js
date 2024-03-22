import './css/App.css';
import { Header } from './component/common/header';
import { PrivateRouter } from './router/privateRouter';
import { Chat } from './component/common/chat';
import { useState } from 'react';


export const App = ({ role }) => {
  const [showChat, setShowChat] = useState(false);

  const handleChat = () => {
    setShowChat(!showChat);
  }

  return (
    <div className="App">
      <Header />
      {/* Outlet 을 활용한 네비게이션 */}
      <div className="warpper">
        <PrivateRouter role={role} />
        {/* <div className='under_bar'  > */}
        {/* <span onClick={handleChat} >채팅창</span> */}
        {/* {showChat ? <Chat /> : null} */}
        {/* </div> */}
      </div>
    </div>
  );
}


