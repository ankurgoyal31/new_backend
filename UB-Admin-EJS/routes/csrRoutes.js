const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const CSR = require('../models/csr');

const csrUpload = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'sideImage', maxCount: 1 },

  { name: 'galleryImage1', maxCount: 1 },
  { name: 'galleryImage2', maxCount: 1 },
  { name: 'galleryImage3', maxCount: 1 },
  { name: 'galleryImage4', maxCount: 1 }
]);

router.get('/', (req, res) => {
  res.render('csr_page/add');
});

// POST route
router.post('/add', csrUpload, async (req, res) => {
  try {
 
    await CSR.create({
      heroImage: req.files.heroImage?.[0]?.location || '',
      heroTitle: req.body.heroTitle,
      heroDescription: req.body.heroDescription,

      sideImage: req.files.sideImage?.[0]?.location || '',
      sideTitle: req.body.sideTitle,
      sideDescription: req.body.sideDescription,
 
      galleryImage1: req.files.galleryImage1?.[0]?.location || '',
      galleryTitle1: req.body.galleryTitle1,
      galleryDescription1: req.body.galleryDescription1,

      galleryImage2: req.files.galleryImage2?.[0]?.location || '',
      galleryTitle2: req.body.galleryTitle2,
      galleryDescription2: req.body.galleryDescription2,

      galleryImage3: req.files.galleryImage3?.[0]?.location || '',
      galleryTitle3: req.body.galleryTitle3,
      galleryDescription3: req.body.galleryDescription3,

      galleryImage4: req.files.galleryImage4?.[0]?.location || '',
      galleryTitle4: req.body.galleryTitle4,
      galleryDescription4: req.body.galleryDescription4
    });

    res.redirect('/dashboard');

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// GET edit route
router.get('/edit', async (req, res) => {
  try {
    const csr = await CSR.findOne();
    res.render('csr_page/edit', { csr: csr || null });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// PUT edit route
router.put('/edit', csrUpload, async (req, res) => {
  try {
    let csr = await CSR.findOne();
    if (!csr) {
      csr = new CSR();
    }

    csr.heroTitle = req.body.heroTitle;
    csr.heroDescription = req.body.heroDescription;
    if (req.files && req.files.heroImage) csr.heroImage = req.files.heroImage[0].location;

    csr.sideTitle = req.body.sideTitle;
    csr.sideDescription = req.body.sideDescription;
    if (req.files && req.files.sideImage) csr.sideImage = req.files.sideImage[0].location;

    csr.galleryTitle1 = req.body.galleryTitle1;
    csr.galleryDescription1 = req.body.galleryDescription1;
    if (req.files && req.files.galleryImage1) csr.galleryImage1 = req.files.galleryImage1[0].location;

    csr.galleryTitle2 = req.body.galleryTitle2;
    csr.galleryDescription2 = req.body.galleryDescription2;
    if (req.files && req.files.galleryImage2) csr.galleryImage2 = req.files.galleryImage2[0].location;

    csr.galleryTitle3 = req.body.galleryTitle3;
    csr.galleryDescription3 = req.body.galleryDescription3;
    if (req.files && req.files.galleryImage3) csr.galleryImage3 = req.files.galleryImage3[0].location;

    csr.galleryTitle4 = req.body.galleryTitle4;
    csr.galleryDescription4 = req.body.galleryDescription4;
    if (req.files && req.files.galleryImage4) csr.galleryImage4 = req.files.galleryImage4[0].location;

    await csr.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

module.exports = router;