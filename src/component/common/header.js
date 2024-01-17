import { useNavigate } from "react-router-dom";
import { useCommonContext } from "../../provider/common"
import { useEffect } from "react";

export const Header = () => {
    const { userInfo, logOut, getToken } = useCommonContext();

    const navigate = useNavigate();

    const navigateHandler = (intersection) => {

        // switch case 문을 이용한 navigate 이벤트
        switch (intersection) {
            case 'member':
                navigate('/admin/member')
                break;
            case 'user':
                navigate('userRegist')
                break;
            case 'dashboard':
                navigate('dashboard')
                break;
            case 'form':
                navigate('/admin/form')
                break;
            case 'corp':
                navigate('/admin/corporation')
                break;
            default:
                navigate('/')
                break
        }
    }

    return (
        <nav id="nav1">
            <a onClick={() => navigateHandler()}>보고, 또 보고</a>
            {userInfo.userAuthority === 1 ?
                <ul>
                    <li><button className="btn" onClick={() => navigateHandler('dashboard')}>Home</button></li>
                    <li><button className="btn" onClick={() => navigateHandler('member')}>회원 관리</button></li>
                    <li><button className="btn" onClick={() => navigateHandler('form')}>보고서폼 관리</button></li>
                    <li><button className="btn" onClick={() => navigateHandler('corp')}>회원기업 관리</button></li>
                    {/* <li><button href="#">menu3</button></li> */}
                    {/* <li><button href="#">menu4</button></li> */}
                    {userInfo.userName != null ? <li><button onClick={logOut} className="btn">로그아웃</button></li> : null}
                </ul> : <ul>
                    <li><button className="btn" href="#">Home</button></li>
                    <li><button className="btn" href="#">보고서 관리</button></li>
                    <li><button className="btn" href="#">프로젝트 관리</button></li>
                    {/* <li><button href="#">menu3</button></li> */}
                    {/* <li><button href="#">menu4</button></li> */}
                </ul>}
        </nav>
    )
}