import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes.js';
import { initDb } from './db.js';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 3000);
const API_PREFIX = process.env.API_PREFIX || '/api';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'To-Do API', api: API_PREFIX });
});

app.use(API_PREFIX, router);

// Error middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to init DB', err);
    process.exit(1);
  });
