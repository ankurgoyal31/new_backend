// const express = require('express');
// const router = express.Router();
// const blogController = require('../controllers/blogController');
// const { isAuthenticated } = require('../middleware/authMiddleware');

// router.get('/', isAuthenticated, blogController.list);
// router.get('/add', isAuthenticated, blogController.addForm);
// router.post('/add', isAuthenticated, blogController.create);
// router.get('/edit/:id', isAuthenticated, blogController.editForm);
// router.put('/edit/:id', isAuthenticated, blogController.update);
// router.delete('/delete/:id', isAuthenticated, blogController.delete);

// module.exports = router;


const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', isAuthenticated, blogController.list);
router.get('/add', isAuthenticated, blogController.addForm);
router.post('/add', isAuthenticated, upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'main_blog_image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'project_detail_image_1', maxCount: 1 }, { name: 'project_detail_image_2', maxCount: 1 }]), blogController.create);
router.get('/edit/:id', isAuthenticated, blogController.editForm);
router.put('/edit/:id', isAuthenticated, upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'main_blog_image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'project_detail_image_1', maxCount: 1 }, { name: 'project_detail_image_2', maxCount: 1 }]), blogController.update);
router.delete('/delete/:id', isAuthenticated, blogController.delete);

module.exports = router; 
