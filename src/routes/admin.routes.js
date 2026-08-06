const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { validate } = require('../middlewares/validation.middleware');
const { createAdminValidation, updateAdminValidation } = require('../validations/admin.validation');
const { paginationValidation } = require('../validations/common.validation');


// Adding dummy auth middleware inline for demonstration of guarded routes
const dummyAuth = (req, res, next) => next();

router.post('/create', createAdminValidation, validate, adminController.create);
router.post('/login', adminController.login);
router.get('/list', dummyAuth, paginationValidation, validate, adminController.findAll);
router.get('/get/:id', dummyAuth, adminController.findOne);
router.patch('/update/:id', dummyAuth, updateAdminValidation, validate, adminController.update);
router.delete('/delete/:id', dummyAuth, adminController.remove);

module.exports = router;
