import { useCommonContext } from "../../provider/common"
import { handleNavi, logout } from "../../js/common.js";
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const { userInfo, setUserInfo } = useCommonContext();

    const navigate = useNavigate();
    return (
        <nav id="nav1">
            <a onClick={() => handleNavi(navigate)}>보고, 또 보고</a>
            {userInfo.userAuthority === 1 ?
                <ul>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'dashboard')}>Home</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'member')}>회원 관리</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'form')}>보고서폼 관리</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'corp')}>회원기업 관리</button></li>
                    {/* <li><button href="#">menu3</button></li> */}
                    {/* <li><button href="#">menu4</button></li> */}
                    {userInfo.userName != null ? <li><button onClick={() => logout(setUserInfo, userInfo)} className="btn">로그아웃</button></li> : null}
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