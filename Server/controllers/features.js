const express = require('express');
const router = express.Router();
const Leads = require('../models/leads');

router.post('/leads', async (req, res) => {
    const workspace_id = req.body.workspaceId;
    const leads = new Leads();
    try {
        const result = await leads.getLeadsByWorkspaceId(workspace_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting leads information:", error);
        res.status(500).send(error);
    }
});

module.exports = router;