/// <reference types="vite/client" />


// Add global type augmentation for window.api
interface Window {
    api: {
        licenseActivation: {
            verifyAndActivateKey: (productKey: string) => Promise<{
                success: boolean;
                data?: LicenseActivation;
                error?: { code: string; message: string };
            }>;
        };
    };
}

type LicenseActivation = {
    id: number;
    productKey: string;
    machineId: string;
    careerId: number;
    signature: string;
    createdAt?: string;
    updatedAt?: string;
};
