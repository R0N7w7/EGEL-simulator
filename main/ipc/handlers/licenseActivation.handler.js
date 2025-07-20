/**
 * @fileoverview IPC handlers para gestionar licencias de activación
 * en la app Electron. Permiten comunicación entre renderer y main
 * para CRUD de licencias locales.
 */

const { ipcMain } = require('electron');
const { licenseActivationService } = require('../../services/licenseActivation.services.js');
const { licenseRemoteService } = require('../../services/remoteLicense.services.js');
const { errorResponse, successResponse } = require('../utils/ipcResponse.js');
const machineIdSync = require('node-machine-id').machineIdSync;
const { verifySignature, generateSignature } = require('../utils/signature.js');

/**
 * Registra todos los canales de IPC para gestionar licencias de activación.
 *
 * Expone métodos para crear, leer, actualizar y eliminar activaciones,
 * pensados para usarse desde el renderer process.
 */
const registerLicenseActivationHandlers = () => {
    /**
     * Obtiene todas las licencias guardadas localmente.
     * Responde a: 'licenseActivation:findAll'
     */
    ipcMain.handle('licenseActivation:findAll', () =>
        licenseActivationService.findAll()
    );

    /**
     * Crea una nueva licencia de activación.
     * Responde a: 'licenseActivation:create'
     * @param {Object} data - Datos de la licencia.
     */
    ipcMain.handle('licenseActivation:create', (_event, data) =>
        licenseActivationService.create(data)
    );

    /**
     * Actualiza una licencia existente por ID.
     * Responde a: 'licenseActivation:update'
     * @param {number} id - ID de la licencia.
     * @param {Object} data - Datos a actualizar.
     */
    ipcMain.handle('licenseActivation:update', (_event, id, data) =>
        licenseActivationService.update(id, data)
    );

    /**
     * Elimina una licencia por ID.
     * Responde a: 'licenseActivation:delete'
     * @param {number} id - ID de la licencia.
     */
    ipcMain.handle('licenseActivation:delete', (_event, id) =>
        licenseActivationService.delete(id)
    );

    /**
     * Busca una licencia por ID.
     * Responde a: 'licenseActivation:findById'
     * @param {number} id - ID de la licencia.
     */
    ipcMain.handle('licenseActivation:findById', (_event, id) =>
        licenseActivationService.findById(id)
    );

    /**
     * Busca una licencia por clave de producto.
     * Responde a: 'licenseActivation:findByProductKey'
     * @param {string} productKey - Clave de producto.
     */
    ipcMain.handle('licenseActivation:findByProductKey', (_event, productKey) =>
        licenseActivationService.findByProductKey(productKey)
    );

    /**
     * Obtiene la primera licencia guardada.
     * Responde a: 'licenseActivation:findFirst'
     */
    ipcMain.handle('licenseActivation:findFirst', () =>
        licenseActivationService.findFirst()
    );

    /**
     * Elimina todas las licencias locales.
     * Responde a: 'licenseActivation:deleteAll'
     */
    ipcMain.handle('licenseActivation:deleteAll', () =>
        licenseActivationService.deleteAll()
    );

    /**
     Manejador IPC para verificar y activar una clave de producto.
     *
    * Flujo completo:
    *  1. Obtiene el machineId local.
    *  2. Consulta en Supabase la licencia con la clave dada.
    *  3. Valida estado de la licencia y restricciones de activación.
    *  4. Realiza el "bind" remoto para asociar la licencia al dispositivo.
    *  5. Verifica si la activación ya está registrada en la base de datos local.
    *  6. Si no existe, crea el registro local de activación.
    * 
    * Evita duplicados locales respetando la restricción UNIQUE en productKey.
    *
    * @param {Electron.IpcMainInvokeEvent} _event - Evento IPC (no usado en este contexto).
    * @param {string} productKey - Clave de producto a verificar y activar.
    * @returns {Promise<Object>} Objeto de activación local (existente o recién creado).
    * @throws {Error} Si la licencia no es válida, está inactiva o no puede asociarse.
    */
    ipcMain.handle('licenseActivation:verifyAndActivateKey', async (_event, productKey) => {
        const machineId = machineIdSync();

        try {
            const license = await licenseRemoteService.fetchLicenseByKey(productKey);
            if (!license) {
                return errorResponse('LICENSE_NOT_FOUND', 'Licencia no encontrada en el servidor remoto.');
            }

            if (license.status !== 'active') {
                return errorResponse('LICENSE_INACTIVE', 'Licencia inactiva o revocada. Contacte al soporte.');
            }

            if (license.machineId && license.machineId !== machineId) {
                return errorResponse('LICENSE_ALREADY_BOUND', 'Esta clave ya está activada en otro dispositivo.');
            }

            const bindSuccess = await licenseRemoteService.bindLicenseToMachine(productKey, machineId);
            if (!bindSuccess) {
                return errorResponse('BIND_FAILED', 'Error al asociar la licencia en el servidor remoto.');
            }

            const existingLocal = await licenseActivationService.findByProductKey(productKey);
            if (existingLocal) {
                return successResponse(existingLocal);
            }

            const payload = {
                productKey,
                machineId,
            };

            const signature = generateSignature(payload);

            const localActivation = await licenseActivationService.create({
                ...payload,
                signature,
            });

            return successResponse(localActivation);

        } catch (err) {
            return errorResponse('UNEXPECTED_ERROR', err.message || 'Ocurrió un error inesperado.');
        }
    });

    /**
     * Valida la licencia almacenada localmente.
     * Responde a: 'licenseActivation:validate'
     *
     * Flujo:
     *  1. Obtiene la primera licencia activada localmente.
     *  2. Reconstruye el payload usado para firmar originalmente.
     *  3. Verifica la validez de la firma.
     *  4. Si es inválida, elimina la licencia local y retorna error.
     *  5. Si es válida, retorna la licencia validada.
     *
     * Esta verificación permite asegurar que la licencia no fue alterada
     * o corrompida desde su activación.
     *
     * @returns {Promise<Object>} Licencia validada o error si es inválida.
     */
    ipcMain.handle('licenseActivation:verifyLocalActivation', async () => {
        const machineId = machineIdSync();

        try {
            const license = await licenseActivationService.findFirst();

            if (!license) {
                return errorResponse('NO_LOCAL_LICENSE', 'No se encontró una licencia local para validar.');
            }

            const payload = {
                productKey: license.productKey,
                machineId
            };

            const isValid = verifySignature(payload, license.signature);

            if (!isValid) {
                await licenseActivationService.delete(license.id);
                return errorResponse('INVALID_SIGNATURE', 'La firma de la licencia no es válida. Se ha eliminado el registro local.');
            }

            return successResponse(license);
        } catch (err) {
            return errorResponse('VALIDATION_ERROR', err.message || 'Error durante la validación de la licencia.');
        }
    });
};

module.exports = {
    registerLicenseActivationHandlers,
};
