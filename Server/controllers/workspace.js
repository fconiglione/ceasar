const express = require('express');
const router = express.Router();
const Workspace = require('../models/workspace');

router.post('/', async (req, res) => {
    const { user_id } = req.body;
    const workspace = new Workspace();
    try {
        const result = await workspace.getWorkspacesByUserId(user_id);
        console.log("Workspace information:", result);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting workspace information:", error);
        res.status(500).send(error);
    }
});

module.exports = router;