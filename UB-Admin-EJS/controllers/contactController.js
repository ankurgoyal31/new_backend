const Contact = require('../models/Contact');

exports.list = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('contacts/list', { contacts });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.view = async (req, res) => {
  try { 
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.redirect('/contacts');
    res.render('contacts/view', { contact });
  } catch (err) {
    res.redirect('/contacts');
  }
}; 

exports.delete = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/contacts');
  } catch (err) {
    res.status(500).send("Error Deleting Contact");
  }
};
