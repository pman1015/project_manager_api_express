import express from 'express';
import project_router from './routes/project_route.js';

const app = express();

app.use(project_router);

app.listen(process.env.PORT || 3000);
