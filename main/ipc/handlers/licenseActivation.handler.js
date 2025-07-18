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
     * Inserta múltiples licencias de activación.
     * Responde a: 'licenseActivation:bulkCreate'
     * @param {Array<Object>} arrayData - Array de datos de licencias.
     */
    ipcMain.handle('licenseActivation:bulkCreate', (_event, arrayData) =>
        licenseActivationService.bulkCreate(arrayData)
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

            const localActivation = await licenseActivationService.create({
                productKey,
                machineId,
                careerId: license.careerId,
                signature: license.signature,
            });

            return successResponse(localActivation);

        } catch (err) {
            return errorResponse('UNEXPECTED_ERROR', err.message || 'Ocurrió un error inesperado.');
        }
    });
};

module.exports = {
    registerLicenseActivationHandlers,
};
