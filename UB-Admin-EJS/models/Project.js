const mongoose = require('mongoose');
const { 
  categories,
  locations,
  priceRanges,
  statusOptions
} = require('../config/projectConfig');

/* ================= FEATURE SCHEMA ================= */
const featureSchema = new mongoose.Schema({
  title: String
}, { _id: false });

/* ================= FAQ SCHEMA ================= */
const faqSchema = new mongoose.Schema({
  question: String,
  answer: String
}, { _id: false });

/* ================= CUSTOM SECTION ================= */
const customSectionSchema = new mongoose.Schema({
  title: { type: String },
  images: [{ type: String }]
}, { _id: false });

/* ================= PROJECT SCHEMA ================= */
const projectSchema = new mongoose.Schema({
 
  /* ================= BASIC INFO ================= */
  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  address: String,

  /* ================= CATEGORY INFO ================= */
  category: {
    type: String,
    enum: categories,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  priceRange: {
    type: String,
    enum: priceRanges
  },

  status: {
    type: String,
    enum: statusOptions,
    default: "Upcoming"
  },
  bedrooms: {
    type: String
  },
  area: {
    type: String
  },
  reraNumber: {
    type: String
  },

 projectVideo: String,
  /* ================= HERO IMAGES ================= */
  heroImage1: {
    type: String,
    required: true
  }, 
locationMapLink: {
  type: String
},
  heroImage2: String,
  heroImage3: String,

  logoImage: String,

  /* ================= BROCHURE ================= */
  brochureFile: String,

  /* ================= ABOUT ================= */
  aboutDescription: String,
  aboutImage: String,

  /* ================= LOCATION (NOW TEXT MAP LINK) ================= */
  locationMapLink: {
    type: String   // 👈 NEW: Google Maps / iframe / URL
  },

  /* ================= MULTI IMAGE SECTIONS ================= */

  masterPlanImages: [String],
  floorPlanImages: [String],
  exclusiveClubImages: [String],
  facilitiesNearbyImages: [String],
  constructionUpdateImages: [String],

  /* ================= FEATURES ================= */
  areaAndLot: [featureSchema],
  interior: [featureSchema],
  exterior: [featureSchema],

  /* ================= HIGHLIGHTS ================= */
  highlights: [{
    title: String,
    image: String
  }],

  /* ================= FAQ ================= */
  faqs: [faqSchema],

  /* ================= CUSTOM ADMIN SECTIONS ================= */
  customSections: [customSectionSchema]

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);