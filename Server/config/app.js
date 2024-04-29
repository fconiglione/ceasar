const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

const app = express();
app.use(bodyParser.json());

dotenv.config();

app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3000', 'https://www.frim.io', 'https://www.api.frim.io', 'https://www.cloud.frim.io', 'https://www.ceasar.frim.io'],
    credentials: true
}))

app.options('*', cors());

const userController = require('../controllers/user');
app.use('/v1/api/users', userController);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;