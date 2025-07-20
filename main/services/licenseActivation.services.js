const db = require('../db/index.js');

class LicenseActivationService {
    /**
     * Crea una nueva licencia de activación.
     * @param {Object} data
     * @returns {Promise<Object>} Objeto creado
     */
    async create(data) {
        const activation = await db.LicenseActivation.create(data);
        return activation.get({ plain: true });
    }

    /**
     * Obtiene todas las activaciones (para debug o uso especial).
     * Omite el campo signature para seguridad.
     * @returns {Promise<Array<Object>>}
     */
    async findAll() {
        const activations = await db.LicenseActivation.findAll();
        return activations.map(a => a.get({ plain: true }));
    }

    /**
     * Busca una activación por ID.
     * Omite el campo signature.
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        const activation = await db.LicenseActivation.findByPk(id);
        return activation ? activation.get({ plain: true }) : null;
    }

    /**
     * Busca una activación por clave de producto.
     * Omite el campo signature.
     * @param {string} productKey
     * @returns {Promise<Object|null>}
     */
    async findByProductKey(productKey) {
        const activation = await db.LicenseActivation.findOne({
            where: { productKey },
        });
        return activation ? activation.get({ plain: true }) : null;
    }

    /**
     * Busca la primera activación.
     * Omite el campo signature.
     * @returns {Promise<Object|null>}
     */
    async findFirst() {
        const activation = await db.LicenseActivation.findOne();
        return activation ? activation.get({ plain: true }) : null;
    }

    /**
     * Actualiza una activación por ID.
     * Retorna el objeto actualizado completo (incluye signature).
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<Object|null>}
     */
    async update(id, data) {
        const activation = await db.LicenseActivation.findByPk(id);
        if (!activation) return null;
        const updated = await activation.update(data);
        return updated.get({ plain: true });
    }

    /**
     * Borra una activación por ID.
     * Retorna el objeto borrado completo (incluye signature).
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    async delete(id) {
        const activation = await db.LicenseActivation.findByPk(id);
        if (!activation) return null;
        const plainActivation = activation.get({ plain: true });
        await activation.destroy();
        return plainActivation;
    }

    /**
     * Borra todas las activaciones (uso muy específico).
     * @returns {Promise<boolean>} true si borró todo
     */
    async deleteAll() {
        await db.LicenseActivation.destroy({ where: {} });
        return true;
    }
}

const licenseActivationService = new LicenseActivationService();

module.exports = {
    licenseActivationService,
};
