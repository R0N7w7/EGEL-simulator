const { DataTypes } = require('sequelize');

/**
 * Crea y devuelve el modelo LicenseActivation.
 * 
 * @param {Sequelize} sequelize - instancia de Sequelize
 * @returns {Model} LicenseActivation
 */
function createLicenseActivationModel(sequelize) {
    return sequelize.define('LicenseActivation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        machineId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        careerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        activatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        signature: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'license_activations',
        timestamps: false,
    });
}

module.exports = createLicenseActivationModel;