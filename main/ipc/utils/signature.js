const crypto = require('crypto');

const SECRET = process.env.SIGNATURE_SECRET;

if (!SECRET) {
    throw new Error('SIGNATURE_SECRET no está definido en las variables de entorno');
}

/**
 * Ordena recursivamente las claves de un objeto para garantizar consistencia en la firma.
 * @param {Object} obj - Objeto a normalizar.
 * @returns {Object} Objeto con claves ordenadas alfabéticamente.
 */
function normalizePayload(obj) {
    if (Array.isArray(obj)) {
        return obj.map(normalizePayload);
    } else if (obj && typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).sort().reduce((acc, key) => {
            acc[key] = normalizePayload(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

/**
 * Genera una firma HMAC-SHA256 para un payload.
 *
 * @param {Object} payload - Los datos a firmar (ej. productKey, machineId, etc.).
 * @returns {string} La firma HMAC generada como string hexadecimal.
 */
function generateSignature(payload) {
    const normalized = normalizePayload(payload);
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(JSON.stringify(normalized));
    return hmac.digest('hex');
}

/**
 * Verifica si una firma es válida para un payload.
 *
 * @param {Object} payload - Los datos originales firmados.
 * @param {string} signature - La firma a verificar.
 * @returns {boolean} true si la firma es válida, false en caso contrario.
 */
function verifySignature(payload, signature) {
    const expected = generateSignature(payload);
    return signature === expected;
}

module.exports = {
    generateSignature,
    verifySignature
};
