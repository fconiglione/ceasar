const express = require('express');
const router = express.Router();
const User = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();

router.post('/token-details', async (req, res) => {
    const sub = req.cookies.sub;
    try {
        res.status(200).send({ sub: sub });
    } catch (error) {
        console.error("Error getting user information:", error);
        res.status(500).send(error);
    }
});

// Admin for testing purposes
router.post('/admin-token-details', async (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        const token_id = process.env.ADMIN_JWT_TOKEN_ID;
        const user = new User();
    try {
        const result = await user.getUserByJWTTokenId(token_id);
        res.status(200).send({ sub: result[0].sub });
    } catch (error) {
        console.error("Error getting user information:", error);
        res.status(500).send(error);
    }
    }
    else {
        const { token_id } = req.body;
        const user = new User();
    try {
        const result = await user.getUserByJWTTokenId(token_id);
        res.status(200).send({ sub: result[0].sub });
    } catch (error) {
        console.error("Error getting user information:", error);
        res.status(500).send(error);
    }
    }
});

module.exports = router;