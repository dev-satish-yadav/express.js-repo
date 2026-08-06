const { body } = require('express-validator');

const createAdminValidation = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'superadmin']).withMessage('Role must be either admin or superadmin')
];

const updateAdminValidation = [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('email').optional().isEmail().withMessage('Must be a valid email address'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'superadmin']).withMessage('Role must be either admin or superadmin')
];

module.exports = {
    createAdminValidation,
    updateAdminValidation
};
