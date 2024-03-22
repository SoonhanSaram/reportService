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
import { ReportList } from "../component/browse/reportlist";
import { ProjectMain } from "../component/browse/projectMain";
import { CreateProject } from "../component/browse/createProject";

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
                    path: '/service/report', element: <ReportList />
                },
                {
                    path: '/service/projectMain', element: <ProjectMain />
                },
                {
                    path: '/service/createProject', element: <CreateProject />
                },
                {
                    path: "/service/dashboard", element: <DashBoard />
                },
            ]
    },
    {
        path: '/owner',
        element: <App role='owner' />,
        children:
            [
                {
                    path: "/owner/project", element: <ProjectMain />
                },
                // {
                //     path: '/owner/uploadReport', element: <UploadReport />
                // },
                {
                    path: '/owner/report', element: <ReportMain />
                },
                {
                    path: "/owner/dashboard", element: <DashBoard />
                },
            ]
    }
]);




