/**
 * @fileoverview Servicio remoto para validar y enlazar licencias en Supabase.
 * Implementado como clase para mantener patrón de diseño.
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Variables de entorno faltantes: SUPABASE_URL o SUPABASE_ANON_KEY.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        console.log("Binding license to machine:", productKey, machineId);
        const { data, error } = await supabase
            .from('licenses')
            .update({ machineId, activated_at: new Date().toISOString() })
            .eq('product_key', productKey);
        console.log("Bind result:", data, error);
        return !error;
    }
}

const licenseRemoteService = new LicenseRemoteService();
module.exports = { licenseRemoteService };
