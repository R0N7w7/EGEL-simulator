/// <reference types="vite/client" />


// Add global type augmentation for window.api
interface Window {
    api: {
        licenseActivation: {
            verifyLocalActivation(): () => Promise<{
                success: boolean;
                data?: LicenseActivation;
                error?: { code: string; message: string };
            }>;
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

interface EGELQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    block: "transversal" | "disciplinary";
    subtopic?: string;
}


    type SimulationType = "disciplinar" | "transversal" | "ambas";
