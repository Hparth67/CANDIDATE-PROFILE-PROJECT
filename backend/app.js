import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import profileRoutes from './routes/profileRoutes.js';
import { sequelize } from './models/index.js';

dotenv.config();

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*'
};
app.use(cors(corsOptions));

app.use(express.json());

// Serve React frontend static files with correct MIME type
app.use(express.static(path.join(__dirname, 'build'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'text/javascript');
    }
  }
}));

// API routes
app.use('/', profileRoutes);

// Catch-all to serve index.html for React Router support
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

(async () => {
  try {
    await sequelize.sync({ alter: true }); // safe schema update
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
})();

app.listen(port, () => console.log(`Server running on port ${port}...`));
