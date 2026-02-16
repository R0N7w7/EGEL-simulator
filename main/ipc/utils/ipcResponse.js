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
    //show a log message in the console with error
    console.error(`IPC Error [${code}]: ${message}`); // potentially should be delete this line in production
    // or use a logging library for better control
    return {
        success: false,
        error: { code, message },
    };
}

module.exports = {
    successResponse,
    errorResponse,
};
