import { Outlet } from 'react-router-dom';
import './css/App.css';
import { Header } from './component/common/header';


export const App = () => {
  return (
    <div className="App">
      <Header />
      {/* Outlet 을 활용한 네비게이션 */}
      <div className="warpper">
        <Outlet />
      </div>
    </div>
  );
}


