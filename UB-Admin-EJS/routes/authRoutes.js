const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



router.get('/login', authController.getLogin);
  
// LOGIN POST
router.post('/login', authController.login); 

//logout 
router.get('/logout', authController.logout);
module.exports = router; 