const { Router } = require('express');
const userController = require('../controllers/users.controller');

const router = Router();

router.post('/login', userController.login);

module.exports = router;
