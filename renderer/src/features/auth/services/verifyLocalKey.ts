export async function verifyLocalKey(): Promise<boolean> {
    try {
        const result = await window.api.licenseActivation.verifyLocalActivation();
        return !!result && !('error' in result);
    } catch {
        return false;
    }
}