/**
 * @fileoverview Servicio remoto para validar y enlazar licencias en Supabase.
 * Implementado como clase para mantener patrón de diseño.
 */
const supabase = require('../supabase/client.js');

class LicenseRemoteService {
    /**
     * Busca una licencia por su clave de producto.
     * @param {string} productKey
     * @returns {Promise<Object|null>}
     */
    async fetchLicenseByKey(productKey) {
        const { data, error } = await supabase
            .from('licenses')
            .select('*')
            .eq('product_key', productKey)
            .single();

        if (error || !data) return null;
        return data;
    }

    /**
     * Asocia un dispositivo (machineId) a la licencia.
     * @param {string} productKey
     * @param {string} machineId
     * @returns {Promise<boolean>}
     */
    async bindLicenseToMachine(productKey, machineId) {
        const { error } = await supabase
            .from('licenses')
            .update({ machineId, activated_at: new Date().toISOString() })
            .eq('product_key', productKey);
        return !error;
    }
}

const licenseRemoteService = new LicenseRemoteService();
module.exports = { licenseRemoteService };
