import { useState } from 'react';



type VerifyResult =
    | { success: boolean; data: LicenseActivation }
    | { success: boolean; error: { code: string; message: string } };

export function useVerifyKey() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<LicenseActivation | null>(null);
    const [error, setError] = useState<{ code: string; message: string } | null>(null);

    const verifyKey = async (productKey: string) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const rawRes = await window.api.licenseActivation.verifyAndActivateKey(productKey);

            let res: VerifyResult;
            if (rawRes.success && rawRes.data) {
                res = { success: true, data: rawRes.data };
                setData(rawRes.data);
            } else {
                const errorObj = rawRes.error ?? { code: 'UNKNOWN_ERROR', message: 'Unknown error occurred.' };
                res = { success: false, error: errorObj };
                setError(errorObj);
            }

            return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            const fallback = {
                code: 'IPC_ERROR',
                message: e.message || 'Fallo inesperado al comunicarse con el proceso principal.',
            };
            setError(fallback);
            return { success: false, error: fallback };
        } finally {
            setLoading(false);
        }
    };

    return {
        verifyKey,
        loading,
        data,
        error,
    };
}