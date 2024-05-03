const express = require('express');
const router = express.Router();
const Search = require('../models/search');

router.post('/', async (req, res) => {
    const { searchTerm, user_id } = req.body;
    const search = new Search();
    try {
        const result = await search.getWorkspacesBySearchTerm(searchTerm, user_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting workspace information:", error);
        res.status(500).send(error);
    }
});

module.exports = router;