const express = require('express');
const router = express.Router();
const User = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();

router.post('/token-details', async (req, res) => {
    // const { token_id } = req.body;
    const token_id = process.env.ADMIN_JWT_TOKEN_ID;
    const user = new User();
    try {
        const result = await user.getUserByJWTTokenId(token_id);
        res.status(200).send({ user_id: result[0].user_id });
    } catch (error) {
        console.error("Error getting user information:", error);
        res.status(500).send(error);
    }
});

module.exports = router;