import type { RouteObject } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import SetupPage from "../pages/SetupPage";
import { AuthLoader } from "../features/auth/components/AuthLoader";
import { TestPage } from "../pages/TestPage";

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <AuthLoader />,
    },
    {
        path: '/auth',
        element: <AuthPage />
    },
    {
        path: '/home',
        element: <HomePage />
    },
    {
        path: '/setup',
        element: <SetupPage />,
    },
    {
        path: '/test',
        element: <TestPage />,
    }
];