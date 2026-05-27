// ===============================
// Load Environment Variables
// ===============================
require('dotenv').config();

// ===============================
// Core Dependencies
// ===============================
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const expressLayouts = require('express-ejs-layouts');
const cors = require("cors");

const methodOverride = require('method-override');

// ===============================
// App Initialization
// ===============================
const app = express();


app.use(
  cors({
    origin: ["https://ub-website-k4mu.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


// ===============================
// Database Connection
// ===============================
const connectDB = require('./config/db');
connectDB();

// ===============================
// View Engine Setup
// ===============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(expressLayouts);
app.set('layout', 'layout'); // views/layout.ejs

// ===============================
// Middlewares
// ===============================
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ 
  extended: true,
  limit: "50mb"
}));
app.use(express.json({
  limit: "50mb"
}));
app.use(methodOverride('_method'));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// Session Configuration
// ===============================
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);


// ===============================
// Make Admin Available in All Views
// ===============================
app.use((req, res, next) => {
  res.locals.admin = req.session.admin || null;

  if (req.session.admin) {
    res.locals.layout = 'layout'; // with sidebar
  } else {
    res.locals.layout = 'auth-layout'; // without sidebar
  }

  next();
});

// ===============================
// Routes (MVC)
// ===============================



// Auth Routes
app.use('/', require('./routes/authRoutes'));

// Dashboard Route
app.use('/', require('./routes/dashboardRoutes'));

// Module Routes
app.use('/blogs', require('./routes/blogRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/contacts', require('./routes/contactRoutes'));

// ===============================
// REST API Routes
// ===============================
app.use('/api/blogs', require('./routes/api/blogApiRoutes'));
app.use('/api/projects', require('./routes/api/projectApiRoutes'));
app.use('/api/contacts', require('./routes/api/contactApiRoutes'));

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).render('404', {
    title: "Page Not Found"
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    title: "Server Error",
    error: err
  });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
