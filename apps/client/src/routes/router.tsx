import { createBrowserRouter } from "react-router-dom";
import { Public, Layoutv1 } from "../layouts";
import ProtectedRoute from "./protectedRoute";
import {
    Landing, Login, Signup, Forgotpassword, 
    Callbacktokenlogin, Customerror, Problems, 
    Problemdetail, Usersettings, Adminsettings,
    Adminproblems
} from "../components/organisms";

const router = () => createBrowserRouter([
    {
        element: <Public />,
        errorElement: <Customerror />,
        children: [
            { index: true, element: <Landing /> },
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <Signup /> },
            { path: '/forgot-password', element: <Forgotpassword /> },
            { path: '/callback', element: <Callbacktokenlogin /> },
        ]
    },
    {
        element: <Layoutv1 />,
        errorElement: <Customerror />,
        children: [
            { path: 'problems', element: <Problems /> },
        ]
    },
    {
        path: '/',
        element: <Layoutv1 />,
        errorElement: <Customerror />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'problems/:id', element: <Problemdetail /> },
                    { path: 'settings', element: <Usersettings /> },
                    { path: 'settings/admin', element: <Adminsettings /> },
                    { path: 'admin/add-problem', element: <Adminproblems /> },
                ],
            },
        ],
    },
]);

export const routerInstance = router();