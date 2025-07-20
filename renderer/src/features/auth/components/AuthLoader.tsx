import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLicenseStore } from '../hooks/useLicenseStore';

export function AuthLoader() {
    const { isValid, loading } = useLicenseStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && isValid !== null) {
            navigate(isValid ? '/home' : '/auth', { replace: true });
        }
    }, [isValid, loading, navigate]);

    if (loading) return <p>Validando licencia...</p>;
    return null;
}
