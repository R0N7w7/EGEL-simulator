/**
 * Genera una respuesta de éxito estandarizada para IPC.
 * @param {any} data - Datos a devolver al renderer.
 * @returns {{ success: true, data: any }}
 */
function successResponse(data) {
    return { success: true, data };
}

/**
 * Genera una respuesta de error estandarizada para IPC.
 * @param {string} code - Código interno de error.
 * @param {string} message - Mensaje de error legible para usuario.
 * @returns {{ success: false, error: { code: string, message: string } }}
 */
function errorResponse(code, message) {
    return {
        success: false,
        error: { code, message },
    };
}

module.exports = {
    successResponse,
    errorResponse,
};
