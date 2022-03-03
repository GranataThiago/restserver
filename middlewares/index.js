const validateFields = require('../middlewares/validate-fields');
const validateFiles = require('../middlewares/validate-files');
const validateToken = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');

module.exports = {
    ...validateFields,
    ...validateToken,
    ...validateRoles,
    ...validateFiles
}