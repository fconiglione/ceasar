const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

dotenv.config();

app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:3000', 'http://localhost:3001', 'https://www.frim.io', 'https://www.api.frim.io', 'https://www.cloud.frim.io', 'https://www.ceasar.frim.io', 'https://www.api.ceasar.frim.io'],
    credentials: true
}))

app.options('*', cors());

const userController = require('../controllers/user');
app.use('/v1/api/users', userController);
const workspaceController = require('../controllers/workspace');
app.use('/v1/api/workspaces', workspaceController);
const searchController = require('../controllers/search');
app.use('/v1/api/search', searchController);
const featuresController = require('../controllers/features');
app.use('/v1/api/features', featuresController);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

module.exports = app;