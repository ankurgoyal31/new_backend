// const express = require('express');
// const router = express.Router();
// const projectController = require('../controllers/projectController');
// const { isAuthenticated } = require('../middleware/authMiddleware');
// const upload = require('../middleware/upload');

// const projectUpload = upload.fields([

//   /* ================= SINGLE FILES ================= */
//   { name: 'projectVideo', maxCount: 1 },
//   { name: 'heroImage1', maxCount: 1 },
//   { name: 'heroImage2', maxCount: 1 },
//   { name: 'heroImage3', maxCount: 1 },

//   { name: 'logoImage', maxCount: 1 },
//   { name: 'brochureFile', maxCount: 1 },
//   { name: 'aboutImage', maxCount: 1 },

//   /* ================= MULTI IMAGE SECTIONS ================= */
//   { name: 'masterPlanImages', maxCount: 50 },
//   { name: 'floorPlanImages', maxCount: 50 },
//   { name: 'exclusiveClubImages', maxCount: 50 },
//   { name: 'facilitiesNearbyImages', maxCount: 50 },
//   { name: 'constructionUpdateImages', maxCount: 50 },

//   /* ================= HIGHLIGHTS ================= */
//   { name: 'highlightImages', maxCount: 50 },

//   /* ================= CUSTOM SECTIONS ================= */
//   { name: 'customSectionImages', maxCount: 200 }
// ]);

// /* ================= LIST ================= */
// router.get('/', isAuthenticated, projectController.list);

// /* ================= ADD FORM ================= */
// router.get('/add', isAuthenticated, projectController.addForm);

// /* ================= CREATE ================= */
// router.post(
//   '/add',
//   isAuthenticated,
//   projectUpload,
//   projectController.create
// );

// /* ================= EDIT FORM ================= */
// router.get('/edit/:id', isAuthenticated, projectController.editForm);

// /* ================= UPDATE ================= */
// router.put(
//   '/edit/:id',
//   isAuthenticated,
//   projectUpload,
//   projectController.update
// );

// /* ================= DELETE ================= */
// router.delete('/delete/:id', isAuthenticated, projectController.delete);
//  module.exports = router;






const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const projectUpload = upload.fields([

  /* ================= SINGLE FILES ================= */
  { name: 'projectVideo', maxCount: 1 }, 
  { name: 'heroImage1', maxCount: 1 },
  { name: 'heroImage2', maxCount: 1 },
  { name: 'heroImage3', maxCount: 1 },
 
  { name: 'logoImage', maxCount: 1 },
  { name: 'brochureFile', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 },

  /* ================= MULTI IMAGE SECTIONS ================= */
  { name: 'masterPlanImages', maxCount: 50 },
  { name: 'floorPlanImages', maxCount: 50 },
  { name: 'exclusiveClubImages', maxCount: 50 },
  { name: 'facilitiesNearbyImages', maxCount: 50 },
  { name: 'constructionUpdateImages', maxCount: 50 },

  /* ================= HIGHLIGHTS ================= */
  { name: 'highlightImages', maxCount: 50 },

  /* ================= CUSTOM SECTIONS ================= */
  { name: 'customSectionImages', maxCount: 200 }, { name: 'replaceImages', maxCount: 100 }
]);

/* ================= LIST ================= */
router.get('/', isAuthenticated, projectController.list);
  
/* ================= ADD FORM ================= */
router.get('/add', isAuthenticated, projectController.addForm);

/* ================= CREATE ================= */
router.post(
  '/add',
  isAuthenticated,
  projectUpload,
  projectController.create
);

/* ================= EDIT FORM ================= */
router.get('/edit/:id', isAuthenticated, projectController.editForm);
// router.post('/edit/:slug', upload, projectController.update);
/* ================= UPDATE ================= */
router.put(
  '/edit/:id',
  isAuthenticated,
  projectUpload,
  projectController.update
);

/* ================= DELETE ================= */
router.delete('/delete/:id', isAuthenticated, projectController.delete);
 module.exports = router;
