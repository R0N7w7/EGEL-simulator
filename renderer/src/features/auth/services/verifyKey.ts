type VerifyResult =
    | { success: true; data: LicenseActivation }
    | { success: false; error: { code: string; message: string } };

// Mapeo de errores técnicos a mensajes genéricos para el cliente
const errorMessages: Record<string, string> = {
    LICENSE_NOT_FOUND: 'La clave ingresada no es válida. Verifica e intenta nuevamente.',
    LICENSE_INACTIVE: 'La clave ingresada no está activa. Por favor contacta al soporte.',
    LICENSE_ALREADY_BOUND: 'La clave ya ha sido activada en otro dispositivo.',
    BIND_FAILED: 'No se pudo activar la clave. Intenta más tarde.',
    UNEXPECTED_ERROR: 'Ha ocurrido un error inesperado. Intenta más tarde.',
    UNKNOWN_ERROR: 'Ha ocurrido un error. Intenta más tarde.',
    IPC_ERROR: 'No se pudo verificar la clave en este momento. Intenta más tarde.',
};

export async function verifyKey(productKey: string): Promise<VerifyResult> {
    try {
        const rawRes = await window.api.licenseActivation.verifyAndActivateKey(productKey);

        if (rawRes.success && rawRes.data) {
            return { success: true, data: rawRes.data };
        } else {
            const code = rawRes.error?.code ?? 'UNKNOWN_ERROR';
            const message = errorMessages[code] ?? 'Ha ocurrido un error inesperado.';
            return {
                success: false,
                error: { code, message },
            };
        }
    } catch {
        return {
            success: false,
            error: {
                code: 'IPC_ERROR',
                message: errorMessages['IPC_ERROR'],
            },
        };
    }
}
