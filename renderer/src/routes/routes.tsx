import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to={'/auth'} />,
    },
    {
        path: '/auth',
        element: <AuthPage />
    }
];