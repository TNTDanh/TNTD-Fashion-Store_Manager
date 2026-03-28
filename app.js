require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { ensureAuthenticated } = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const variantRoutes = require('./routes/variantRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const customerRoutes = require('./routes/customerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devsecret',
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.flash = req.session.flash || null;
  req.session.flash = null;
  next();
});

app.use('/', authRoutes);
app.use('/dashboard', ensureAuthenticated, dashboardRoutes);
app.use('/categories', ensureAuthenticated, categoryRoutes);
app.use('/products', ensureAuthenticated, productRoutes);
app.use('/variants', ensureAuthenticated, variantRoutes);
app.use('/suppliers', ensureAuthenticated, supplierRoutes);
app.use('/customers', ensureAuthenticated, customerRoutes);
app.use('/purchases', ensureAuthenticated, purchaseRoutes);
app.use('/sales', ensureAuthenticated, salesRoutes);

app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  return res.redirect('/login');
});

app.use((req, res) => {
  res.status(404).render('partials/404', { title: 'Không tìm thấy' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
