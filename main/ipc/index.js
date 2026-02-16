const { registerLicenseActivationHandlers } = require('./handlers/licenseActivation.handler.js');

const registerIpcHandlers = () => {
    registerLicenseActivationHandlers();
};

module.exports = {
    registerIpcHandlers,
};