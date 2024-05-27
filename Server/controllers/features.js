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

router.post('/leads/create', async (req, res) => {
    const { workspace_id, photo_url, full_name, phone_number, email, company, status_id, description } = req.body.lead;
    const nameParts = full_name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const leads = new Leads();
    try {
        const result = await leads.createLead(workspace_id, photo_url, first_name, last_name, phone_number, email, company, status_id, description);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).send(error);
    }
});

module.exports = router;