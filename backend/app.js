import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './routes/profileRoutes.js';
import {sequelize} from './models/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



(async () => {
  try {
    await sequelize.sync({ alter: true }); // Use alter:true for safe schema update; or force:true to drop & recreate
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
})();


app.use('/', profileRoutes);

app.listen(port, () => console.log(`Server running on port ${port}...`));
