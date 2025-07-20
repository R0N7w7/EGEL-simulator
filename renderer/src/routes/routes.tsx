import type { RouteObject } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import { AuthLoader } from "../features/auth/components/AuthLoader";

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <AuthLoader />,
    },
    {
        path: '/auth',
        element: <AuthPage />
    },
];