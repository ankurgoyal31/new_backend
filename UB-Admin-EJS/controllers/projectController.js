const Project = require('../models/Project');
const slugify = require('slugify');
const projectConfig = require('../config/projectConfig');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

/* ================= AWS CONFIG ================= */
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

/* ================= DELETE FROM S3 ================= */
const deleteFromS3 = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const key = fileUrl.split('.amazonaws.com/')[1];
    if (!key) return;

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    }));
  } catch (err) {
    console.error("S3 Delete Error:", err);
  }
};

/* ================= LIST ================= */
exports.list = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('projects/list', { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/* ================= ADD FORM ================= */
exports.addForm = (req, res) => {
  res.render('projects/add', { config: projectConfig });
};

/* ================= EDIT FORM ================= */
exports.editForm = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.redirect('/projects');

    res.render('projects/edit', {
      project,
      config: projectConfig
    });
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
};

/* ================= CREATE ================= */
exports.create = async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true, strict: true });
    if (!req.files['heroImage1'])
      return res.status(400).send("Hero Image 1 Required");

    const getFile = (field) =>
      req.files[field] ? req.files[field][0].location : '';

    /* ================= FEATURES ================= */
    const makeArray = (field) => {
      if (!req.body[field]) return [];
      return Array.isArray(req.body[field])
        ? req.body[field].map(title => ({ title }))
        : [{ title: req.body[field] }];
    };

    /* ================= HIGHLIGHTS ================= */
    let highlights = [];

    if (req.body.highlightTitle) {
      const titles = Array.isArray(req.body.highlightTitle)
        ? req.body.highlightTitle
        : [req.body.highlightTitle];

      const images = req.files['highlightImages'] || [];

      highlights = titles.map((title, index) => ({
        title,
        image: images[index] ? images[index].location : ''
      }));
    }

    /* ================= FAQ ================= */
    let faqs = [];

    if (req.body.faqQuestion) {
      const questions = Array.isArray(req.body.faqQuestion)
        ? req.body.faqQuestion
        : [req.body.faqQuestion];

      const answers = Array.isArray(req.body.faqAnswer)
        ? req.body.faqAnswer
        : [req.body.faqAnswer];

      faqs = questions.map((q, i) => ({
        question: q,
        answer: answers[i]
      }));
    }

    /* ================= MULTI IMAGE SECTIONS ================= */
    const mapFiles = (field) =>
      req.files[field] ? req.files[field].map(f => f.location) : [];
   
    /* ================= CUSTOM SECTIONS ================= */
    let customSections = [];
 
    if (req.body.customSectionTitle) {
      const titles = Array.isArray(req.body.customSectionTitle)
        ? req.body.customSectionTitle
        : [req.body.customSectionTitle];

      const images = req.files['customSectionImages'] || [];
      let imgIndex = 0;

      customSections = titles.map(title => {
        const sectionImages = [];

        // simple grouping (sequential)
        while (imgIndex < images.length) {
          sectionImages.push(images[imgIndex].location);
          imgIndex++;
        }

        return {
          title,
          images: sectionImages
        };
      });
    }

    /* ================= CREATE ================= */
    await Project.create({
      name: req.body.name,
      slug,
      address: req.body.address,
      
      category: req.body.category,
      location: req.body.location,
      priceRange: req.body.priceRange,
      status: req.body.status,
      bedrooms: req.body.bedrooms,
      area: req.body.area,
      reraNumber: req.body.reraNumber,
      projectVideo: getFile('projectVideo'),
      heroImage1: getFile('heroImage1'),
      heroImage2: getFile('heroImage2'),
      heroImage3: getFile('heroImage3'), 
      logoImage: getFile('logoImage'),
      brochureFile: getFile('brochureFile'),

      aboutDescription: req.body.aboutDescription,
      aboutImage: getFile('aboutImage'),

      /* ================= NEW LOCATION FIELD ================= */
      locationMapLink: req.body.location,

      /* ================= MULTI IMAGES ================= */
      masterPlanImages: mapFiles('masterPlanImages'),
      floorPlanImages: mapFiles('floorPlanImages'),
      exclusiveClubImages: mapFiles('exclusiveClubImages'),
      facilitiesNearbyImages: mapFiles('facilitiesNearbyImages'),
      constructionUpdateImages: mapFiles('constructionUpdateImages'),

      areaAndLot: makeArray('areaAndLot'),
      interior: makeArray('interior'),
      exterior: makeArray('exterior'),

      highlights,
      faqs,
      customSections
    });

    res.redirect('/projects');

  } catch (err) {
    console.error(err);
    res.status(500).send("Error Creating Project");
  }
};

/* ================= UPDATE ================= */
exports.update = async (req, res) => {
  try {  

    const project = await Project.findById(req.params.id);
    if (!project) return res.redirect('/projects');

    const slug = slugify(req.body.name, { lower: true, strict: true });

    const updateData = {
      name: req.body.name,
      slug,
      address: req.body.address,
      aboutDescription: req.body.aboutDescription,
      category: req.body.category,
      location: req.body.location,
      priceRange: req.body.priceRange,
      status: req.body.status,
      bedrooms: req.body.bedrooms,
      area: req.body.area,
      reraNumber: req.body.reraNumber
    };

    /* ================= FILE UPDATE ================= */
    const updateFile = async (field) => {
      if (req.files[field]) {
        await deleteFromS3(project[field]);
        updateData[field] = req.files[field][0].location;
      }
    };

    const singleFiles = [
      'heroImage1','heroImage2','heroImage3','logoImage','brochureFile','aboutImage','projectVideo'
    ];

    for (let field of singleFiles) {
      await updateFile(field);
    }

/* ================= MULTI IMAGE UPDATE ================= */

const multiFields = [
  'masterPlanImages',
  'floorPlanImages',
  'exclusiveClubImages',
  'facilitiesNearbyImages',
  'constructionUpdateImages'
]; 

/* CLONE OLD DATA */
multiFields.forEach(field => {
  updateData[field] = [...(project[field] || [])];
});

/* ================= ADD NEW IMAGES ================= */

for (let field of multiFields) {

  if (
    req.files[field] && 
    req.files[field].length > 0
  ) {

    const newImages = req.files[field].map(
      f => f.location
    );

    updateData[field].push(...newImages);
  }
}

/* ================= SPECIFIC IMAGE REPLACE ================= */

if (
  req.files.replaceImages &&
  req.files.replaceImages.length > 0
) {

  const indexes = Array.isArray(req.body.replaceIndexes)
    ? req.body.replaceIndexes
    : [req.body.replaceIndexes];

  req.files.replaceImages.forEach((file, i) => {

    const value = indexes[i];

    if (!value) return;

    const [field, index] = value.split('-');

    if (
      updateData[field] &&
      updateData[field][index]
    ) {

      updateData[field][index] = file.location;
    }
  });
}

 //delete

 /* ================= SPECIFIC IMAGE REPLACE ================= */

if (
  req.files.replaceImages &&
  req.files.replaceImages.length > 0
) {

  const indexes = Array.isArray(req.body.replaceIndexes)
    ? req.body.replaceIndexes
    : [req.body.replaceIndexes];

  req.files.replaceImages.forEach((file, i) => {

    const value = indexes[i];

    if (!value) return;

    const [field, index] = value.split('-');

    if (
      updateData[field] &&
      updateData[field][index]
    ) {

      updateData[field][index] = file.location;
    }
  });
}


/* ================= DELETE SINGLE IMAGE ================= */


if (req.body.deleteImage) {

  const [field, index] =
    req.body.deleteImage.split('-');

  if (
    updateData[field] &&
    updateData[field][index]
  ) {

    await deleteFromS3(
      updateData[field][index]
    );

    updateData[field].splice(index, 1);
  }
}


    /* ================= FEATURES ================= */
    const makeArray = (field) => {
      if (!req.body[field]) return [];
      return Array.isArray(req.body[field])
        ? req.body[field].map(title => ({ title }))
        : [{ title: req.body[field] }];
    };

    updateData.areaAndLot = makeArray('areaAndLot');
    updateData.interior = makeArray('interior');
    updateData.exterior = makeArray('exterior');

    /* ================= HIGHLIGHTS ================= */
    let highlights = [];

    if (req.body.highlightTitle) {
      const titles = Array.isArray(req.body.highlightTitle)
        ? req.body.highlightTitle
        : [req.body.highlightTitle];

      const images = req.files['highlightImages'] || [];

      highlights = titles.map((title, index) => ({
        title,
        image: images[index]
          ? images[index].location
          : project.highlights[index]
            ? project.highlights[index].image
            : ''
      }));
    }

    updateData.highlights = highlights;

    /* ================= FAQ ================= */
    let faqs = [];

    if (req.body.faqQuestion) {
      const questions = Array.isArray(req.body.faqQuestion)
        ? req.body.faqQuestion
        : [req.body.faqQuestion];

      const answers = Array.isArray(req.body.faqAnswer)
        ? req.body.faqAnswer
        : [req.body.faqAnswer];

      faqs = questions.map((q, i) => ({
        question: q,
        answer: answers[i]
      }));
    }

    updateData.faqs = faqs;

    /* ================= CUSTOM SECTIONS ================= */
    let customSections = [];

    if (req.body.customSectionTitle) {
      const titles = Array.isArray(req.body.customSectionTitle)
        ? req.body.customSectionTitle
        : [req.body.customSectionTitle];

      const images = req.files['customSectionImages'] || [];
      let imgIndex = 0;

      customSections = titles.map(title => {
        const sectionImages = [];

        while (imgIndex < images.length) {
          sectionImages.push(images[imgIndex].location);
          imgIndex++;
        }

        return {
          title,
          images: sectionImages
        };
      });
    }

    updateData.customSections = customSections;

    /* ================= SAVE ================= */
    await Project.findByIdAndUpdate(req.params.id, updateData);

    res.redirect('/projects');

  } catch (err) {
    console.error(err);
    res.status(500).send("Error Updating Project");
  }
};

/* ================= DELETE ================= */
exports.delete = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);
    if (!project) return res.redirect('/projects');

    const singleImages = [
      'heroImage1','heroImage2','heroImage3','logoImage','brochureFile','aboutImage','projectVideo'
    ];

    for (let field of singleImages) {
      await deleteFromS3(project[field]);
    }

    const multiImages = [
      'masterPlanImages',
      'floorPlanImages',
      'exclusiveClubImages',
      'facilitiesNearbyImages',
      'constructionUpdateImages'
    ];

    for (let field of multiImages) {
      if (project[field]) {
        for (let img of project[field]) {
          await deleteFromS3(img);
        }
      }
    }

    if (project.highlights) {
      for (let item of project.highlights) {
        await deleteFromS3(item.image);
      }
    }

    if (project.customSections) {
      for (let section of project.customSections) {
        for (let img of section.images) {
          await deleteFromS3(img);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res.redirect('/projects');

  } catch (err) {
    console.error(err);
    res.status(500).send("Error Deleting Project");
  }
};
