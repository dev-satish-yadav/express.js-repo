const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validate } = require('../middlewares/validation.middleware');
const { createUserValidation, updateUserValidation } = require('../validations/user.validation');

// Adding dummy auth middleware inline for demonstration of guarded routes
const dummyAuth = (req, res, next) => next();

router.post('/create', createUserValidation, validate, userController.create);
router.post('/login', userController.login);
router.get('/list', userController.findAll);
router.get('/get/:id', dummyAuth, userController.findOne);
router.patch('/update/:id', dummyAuth, updateUserValidation, validate, userController.update);

module.exports = router;
