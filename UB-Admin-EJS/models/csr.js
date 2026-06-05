const mongoose = require('mongoose');

const csrSchema = new mongoose.Schema({
    title: String,
    description: String,

    heroImage: String,
    heroTitle: String,
    heroDescription: String,

    sideImage: String,
    sideTitle: String,
    sideDescription: String,

    galleryImage1: String,
    galleryTitle1: String,
    galleryDescription1: String,

    galleryImage2: String,
    galleryTitle2: String,
    galleryDescription2: String,

    galleryImage3: String,
    galleryTitle3: String,
    galleryDescription3: String,

    galleryImage4: String,
    galleryTitle4: String,
    galleryDescription4: String
}, {
    timestamps: true
});

module.exports = mongoose.model('CSR', csrSchema);