const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validate } = require('../middlewares/validation.middleware');
const { createUserValidation, updateUserValidation } = require('../validations/user.validation');
const { paginationValidation } = require('../validations/common.validation');


const { verifyUserToken } = require('../middlewares/user.middleware');

router.post('/create', createUserValidation, validate, userController.create);
router.post('/login', userController.login);
router.get('/list', verifyUserToken, paginationValidation, validate, userController.findAll);
router.get('/get/:id', verifyUserToken, userController.findOne);
router.patch('/update/:id', verifyUserToken, updateUserValidation, validate, userController.update);

module.exports = router;
