const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { validate } = require('../middlewares/validation.middleware');
const { createAdminValidation, updateAdminValidation } = require('../validations/admin.validation');
const { paginationValidation } = require('../validations/common.validation');


const { verifyAdminToken } = require('../middlewares/admin.middleware');

router.post('/create', createAdminValidation, validate, adminController.create);
router.post('/login', adminController.login);
router.get('/list', verifyAdminToken, paginationValidation, validate, adminController.findAll);
router.get('/get/:id', verifyAdminToken, adminController.findOne);
router.patch('/update/:id', verifyAdminToken, updateAdminValidation, validate, adminController.update);
router.delete('/delete/:id', verifyAdminToken, adminController.remove);

module.exports = router;
