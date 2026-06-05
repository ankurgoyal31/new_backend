// middleware/authMiddleware.js

exports.isAuthenticated = (req, res, next) => {
  try {
    if (req.session && req.session.admin) {
      return next();
    }      
 
    return res.redirect('/login');
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.redirect('/login');
  }
};