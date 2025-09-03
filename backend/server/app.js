import express from 'express';
import cors from 'cors';
import routes from './routes.js';

let app = express();
let { PORT = 0 } = process.env;

// Middlewares
app.use(cors())
app.use(express.json({ limit: '100mb' }));
app.use('/api/assets', express.static('./templates/assets'));
app.use('/api', routes);

// Listen
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);    
});