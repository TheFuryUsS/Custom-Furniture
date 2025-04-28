// Rutes d'usuaris

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const authenticate = require('../middleware/auth');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authenticate, getUser);

module.exports = router;