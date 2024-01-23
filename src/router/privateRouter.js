import { Navigate, Outlet } from "react-router-dom";
import { useCommonContext } from "../provider/common"

export const PrivateRouter = ({ role }) => {
    const { userInfo } = useCommonContext();

    const { isLogin, userAuthority } = userInfo;

    return role === undefined ? <Outlet /> : isLogin && userAuthority === role ? <Outlet /> : <Navigate to='/' />
};