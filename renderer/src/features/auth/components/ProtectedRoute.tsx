import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLicenseStore } from '../hooks/useLicenseStore';

export function ProtectedRoute({ children }: Readonly<{ children: React.ReactNode }>) {
    const { isValid, loading } = useLicenseStore();

    if (loading) return <p>Validando licencia...</p>;
    if (!isValid) return <Navigate to="/auth" replace />;

    return <>{children}</>;
}
