import { useCommonContext } from "../../provider/common"
import { handleNavi } from "../../js/common.js";
import { useNavigate } from "react-router-dom";
import { logout } from "../../js/apis/api/login.js";

export const Header = () => {
    const { userInfo, setUserInfo } = useCommonContext();
    const { userAuthority } = userInfo;
    const navigate = useNavigate();
    return (
        <nav id="nav1">
            <a onClick={() => handleNavi(navigate, null, userAuthority)}>보고, 또 보고</a>
            {userAuthority === 'admin' && userInfo.isLogin ?
                <ul>
                    <li><button className="btn" onClick={() => handleNavi(navigate, '', userAuthority)}>Home</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'member', userAuthority)}>회원 관리</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'form', userAuthority)}>보고서폼 관리</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'corp', userAuthority)}>회원기업 관리</button></li>
                    {/* <li><button href="#">menu3</button></li> */}
                    {/* <li><button href="#">menu4</button></li> */}
                    {userInfo.userName != null ? <li><button onClick={() => logout(setUserInfo, userInfo)} className="btn">로그아웃</button></li> : null}
                </ul> : userAuthority === 'mate' && userInfo.isLogin ? <ul>
                    <li><button className="btn" onClick={() => handleNavi(navigate, '', userAuthority)}>Home</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'report', userAuthority)}>보고서 관리</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'project', userAuthority)}>프로젝트 관리</button></li>
                    {userInfo.userName != null ? <li><button onClick={() => logout(setUserInfo, userInfo)} className="btn">로그아웃</button></li> : null}
                    {/* <li><button href="#">menu3</button></li> */}
                    {/* <li><button href="#">menu4</button></li> */}
                </ul> : <ul>
                    <li><button className="btn" onClick={() => handleNavi(navigate, '', userAuthority)}>Home</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'report', userAuthority)}>보고서 관리</button></li>
                    <li><button className="btn" onClick={() => handleNavi(navigate, 'project', userAuthority)}>프로젝트 관리</button></li>
                </ul>}
        </nav>
    )
}