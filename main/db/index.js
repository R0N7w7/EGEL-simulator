const path = require('path');
const { app } = require('electron');
const { Sequelize } = require('sequelize');
const createLicenseActivationModel = require('./models/LicenseActivation.js');

const isElectron = process.versions.hasOwnProperty('electron');

const storagePath = isElectron
    ? path.join(app.getPath('userData'), 'data.sqlite')
    : path.join(__dirname, 'data.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
});

const LicenseActivation = createLicenseActivationModel(sequelize);

module.exports = {
    sequelize,
    LicenseActivation,
};