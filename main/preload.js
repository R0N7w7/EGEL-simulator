/**
 * @fileoverview Preload script para exponer métodos seguros al renderer.
 *
 * Define el puente entre el renderer process y el main process
 * para la gestión de activaciones de licencias locales mediante IPC.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    /**
     * Grupo de métodos para gestionar activaciones de licencias locales.
     * Provee CRUD completo para la tabla de LicenseActivation en SQLite local.
     */
    licenseActivation: {
        /**
         * Busca una activación por clave de producto.
         * @param {string} productKey
         * @returns {Promise<Object|null>}
         */
        findByProductKey: (productKey) => ipcRenderer.invoke('licenseActivation:findByProductKey', productKey),

        /**
         * Verifica si existe una activación local válida.
         * @returns {Promise<Object|null>} Retorna la activación si es válida, null si no existe o es inválida.
         */
        verifyLocalActivation: () => ipcRenderer.invoke('licenseActivation:verifyLocalActivation'),

        /**
         * valida una licencia remota en Supabase.
         * @param {string} productKey
         * @returns {Promise<Object|null>}
         */
        verifyAndActivateKey: (productKey) => {
            return ipcRenderer.invoke('licenseActivation:verifyAndActivateKey', productKey);
        },
    },
});
