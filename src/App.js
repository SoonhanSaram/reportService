import './css/App.css';
import { Header } from './component/common/header';
import { PrivateRouter } from './router/privateRouter';


export const App = ({ role }) => {
  return (
    <div className="App">
      <Header />
      {/* Outlet 을 활용한 네비게이션 */}
      <div className="warpper">
        <PrivateRouter role={role} />
      </div>
    </div>
  );
}


