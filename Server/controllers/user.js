const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/token-details', async (req, res) => {
    const { token_id } = req.body;
    const user = new User();
    try {
        const result = await user.getUserByJWTTokenId(token_id);
        res.status(200).send({user_id: result});
    } catch (error) {
        console.error("Error getting user information:", error);
        res.status(500).send(error);
    }
});

module.exports = router;