import { createBrowserRouter } from "react-router-dom";

// 컴포넌트 import
import { App } from "../App";
import { CorpRegist } from "../component/login/corpRegist";
import { UserRegist } from "../component/login/userRegist";
import { Login } from "../component/login/login";
import { DashBoard } from "../component/browse/dashboard";
import { ManageMember } from "../component/admin/manageMember";
import { ManageForm } from "../component/admin/manageForm";
import { ManageCorp } from "../component/admin/manageCorp";
import { UploadReport } from "../component/browse/uploadReport";
import { ReportMain } from "../component/browse/reportMain";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "", element: <Login />
            },
            {
                path: "/corRegist", element: <CorpRegist />
            },
            {
                path: "/userRegist", element: <UserRegist />
            },
        ]
    },
    {
        path: '/admin',
        element: <App role='admin' />,
        children: [
            {
                path: '/admin/member', element: <ManageMember />
            },
            {
                path: '/admin/form', element: <ManageForm />
            },
            {
                path: '/admin/corporation', element: <ManageCorp />
            },
            {
                path: "/admin/dashboard", element: <DashBoard />
            },
        ]
    },
    {
        path: '/service',
        element: <App role='mate' />,
        children:
            [
                {
                    path: '/service/uploadReport', element: <UploadReport />
                },
                {
                    path: '/service/report', element: <ReportMain />
                },
                {
                    path: "/service/dashboard", element: <DashBoard />
                },
            ]
    }
]);




