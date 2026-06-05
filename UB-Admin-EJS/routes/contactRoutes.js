const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, contactController.list);
router.get('/view/:id', isAuthenticated, contactController.view);
router.delete('/delete/:id', isAuthenticated, contactController.delete);
  
module.exports = router;  