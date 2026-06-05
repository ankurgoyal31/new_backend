const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const CSR = require('../models/csr');

exports.dashboard = async (req, res) => {
  try { 
    // Get Counts
    const blogCount = await Blog.countDocuments();
    const projectCount = await Project.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    const csrCount = await CSR.countDocuments();
    const csrExists = csrCount > 0;

    // Render Dashboard
    res.render('dashboard', {
      layout: 'layout',   // dashboard layout with sidebar
      title: 'Dashboard',
      admin: req.session.admin,
      blogCount,
      projectCount,
      contactCount,
      csrExists
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
 
    res.status(500).render('500', {
      layout: 'layout',
      title: 'Server Error',
      error: error.message 
    });
  }
};
