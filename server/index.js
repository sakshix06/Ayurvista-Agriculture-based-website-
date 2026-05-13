const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayurvista';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* =========================
         IMPORT ROUTES
========================= */

const authRoutes = require('./routes/authRoutes');

const {
  mailerRouter,
} = require('./routes/mailer.routes.cjs');

/* =========================
          USE ROUTES
========================= */

app.use('/api/auth', authRoutes);

app.use('/api/mail', mailerRouter);

/* =========================
        HEALTH CHECK
========================= */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

/* =========================
          SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);