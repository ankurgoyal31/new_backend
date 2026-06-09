const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  category: { 
    type: String, 
    enum: ['All', 'Architecture', 'Interior Design', 'Lifestyle', 'Township Planning'], 
    default: 'All'
  },
  heroImage: String,
  Banner_content: String,
  main_blog_image: String,
  project_detail_image_1: String,
  project_detail_image_2: String,
  images: [String], 

  status: { type: String, default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
