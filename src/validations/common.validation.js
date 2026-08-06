const { query } = require('express-validator');

const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('sort')
        .optional()
        .isString().withMessage('Sort parameter must be a string'),
    query('sort_type')
        .optional()
        .isIn(['asc', 'desc']).withMessage('Sort type must be either asc or desc')
];

module.exports = { paginationValidation };
