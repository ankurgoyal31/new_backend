// const Blog = require('../models/Blog');

// /* =========================
//    LIST BLOGS
// ========================= */
// exports.list = async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ createdAt: -1 });

//     res.render('blogs/list', {
//       layout: 'layout',
//       title: 'All Blogs', 
//       admin: req.session.admin,
//       blogs
//     });

//   } catch (error) {
//     console.error("Blog List Error:", error);
//     res.status(500).render('500', {
//       layout: false,
//       message: 'Failed to load blogs'
//     });
//   }
// };


// /* =========================
//    SHOW ADD FORM
// ========================= */
// exports.addForm = (req, res) => {
//   res.render('blogs/add', {
//     layout: 'layout',
//     title: 'Add Blog',
//     admin: req.session.admin
//   });
// };


// /* =========================
//    CREATE BLOG
// ========================= */
// exports.create = async (req, res) => {
//   try {
//     await Blog.create({
//       title: req.body.title,
//       content: req.body.content,
//       author: req.session.admin?.name || "Admin"
//     });

//     res.redirect('/blogs');
 
//   } catch (error) {
//     console.error("Create Blog Error:", error);
//     res.status(500).render('500', {
//       layout: false,
//       message: 'Failed to create blog'
//     });
//   }
// };


// /* =========================
//    SHOW EDIT FORM
// ========================= */
// exports.editForm = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) return res.redirect('/blogs');

//     res.render('blogs/edit', {
//       layout: 'layout',
//       title: 'Edit Blog',
//       admin: req.session.admin,
//       blog
//     });

//   } catch (error) {
//     console.error("Edit Form Error:", error);
//     res.redirect('/blogs');
//   }
// };


// /* =========================
//    UPDATE BLOG
// ========================= */
// exports.update = async (req, res) => {
//   try {
//     await Blog.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       content: req.body.content
//     });

//     res.redirect('/blogs');

//   } catch (error) {
//     console.error("Update Blog Error:", error);
//     res.redirect('/blogs');
//   }
// };


// /* =========================
//    DELETE BLOG
// ========================= */
// exports.delete = async (req, res) => {
//   try {
//     await Blog.findByIdAndDelete(req.params.id);
//     res.redirect('/blogs');

//   } catch (error) {
//     console.error("Delete Blog Error:", error);
//     res.redirect('/blogs');
//   }
// };






const Blog = require('../models/Blog');

/* =========================
   LIST BLOGS
========================= */
exports.list = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.render('blogs/list', {
      layout: 'layout',
      title: 'All Blogs',
      admin: req.session.admin,
      blogs
    });

  } catch (error) {
    console.error("Blog List Error:", error);
    res.status(500).render('500', {
      layout: false,
      message: 'Failed to load blogs'
    });
  }
};


/* =========================
   SHOW ADD FORM
========================= */
exports.addForm = (req, res) => {
  res.render('blogs/add', {
    layout: 'layout',
    title: 'Add Blog',
    admin: req.session.admin
  });
};


/* =========================
   CREATE BLOG
========================= */
exports.create = async (req, res) => {
  try {
    const heroImage = req.files && req.files['heroImage'] ? req.files['heroImage'][0].location : null;
    const main_blog_image = req.files && req.files['main_blog_image'] ? req.files['main_blog_image'][0].location : null;
    const project_detail_image_1 = req.files && req.files['project_detail_image_1'] ? req.files['project_detail_image_1'][0].location : null;
    const project_detail_image_2 = req.files && req.files['project_detail_image_2'] ? req.files['project_detail_image_2'][0].location : null;
    const images = req.files && req.files['images'] ? req.files['images'].map(file => file.location) : [];

    await Blog.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author || req.session.admin?.name || "Admin",
      category: req.body.category || 'All',
      heroImage: heroImage,
      Banner_content: req.body.Banner_content,
      main_blog_image: main_blog_image,
      project_detail_image_1: project_detail_image_1,
      project_detail_image_2: project_detail_image_2,
      images: images
    });
    res.redirect('/blogs'); 
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).render('500', {
      layout: false,
      message: 'Failed to create blog'
    });
  }
};


/* =========================
   SHOW EDIT FORM
========================= */
exports.editForm = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.redirect('/blogs');

    res.render('blogs/edit', {
      layout: 'layout',
      title: 'Edit Blog',
      admin: req.session.admin,
      blog
    });

  } catch (error) {
    console.error("Edit Form Error:", error);
    res.redirect('/blogs');
  }
};


/* =========================
   UPDATE BLOG
========================= */
exports.update = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.redirect('/blogs');

    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === 'string') {
        existingImages = [existingImages];
    }
    
    const newHeroImage = req.files && req.files['heroImage'] ? req.files['heroImage'][0].location : blog.heroImage;
    const new_main_blog_image = req.files && req.files['main_blog_image'] ? req.files['main_blog_image'][0].location : blog.main_blog_image;
    const new_project_detail_image_1 = req.files && req.files['project_detail_image_1'] ? req.files['project_detail_image_1'][0].location : blog.project_detail_image_1;
    const new_project_detail_image_2 = req.files && req.files['project_detail_image_2'] ? req.files['project_detail_image_2'][0].location : blog.project_detail_image_2;
    const newImages = req.files && req.files['images'] ? req.files['images'].map(file => file.location) : [];
    const updatedImages = [...existingImages, ...newImages];

    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author || blog.author,
      category: req.body.category || blog.category,
      heroImage: newHeroImage,
      Banner_content: req.body.Banner_content|| blog.Banner_content,
      main_blog_image: new_main_blog_image,
      project_detail_image_1: new_project_detail_image_1,
      project_detail_image_2: new_project_detail_image_2,
      images: updatedImages
    });
    res.redirect('/blogs');

  } catch (error) {
    console.error("Update Blog Error:", error);
    res.redirect('/blogs');
  }
};


/* =========================
   DELETE BLOG
========================= */
exports.delete = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');

  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.redirect('/blogs');
  }
};
