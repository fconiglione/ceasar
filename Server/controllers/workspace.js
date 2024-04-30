const express = require('express');
const router = express.Router();
const Workspace = require('../models/workspace');

router.post('/index', async (req, res) => {
    const { user_id } = req.body;
    const workspace = new Workspace();
    try {
        const result = await workspace.getWorkspacesByUserId(user_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting workspace information:", error);
        res.status(500).send(error);
    }
});

router.post('/create', async (req, res) => {
    const user_id = req.body.user_id;
    if (!user_id) {
        return res.status(401).send("No token id available.");
    }
    console.log("User:", user_id);
    const { title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts } = req.body.workspace;
    const workspace = new Workspace();
    try {
        const result = await workspace.createWorkspace(user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error creating workspace:", error);
        res.status(500).send(error);
    }
});

router.delete('/:workspace_id' , async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const workspace = new Workspace();
    try {
        const result = await workspace.deleteWorkspace(workspace_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error deleting workspace:", error);
        res.status(500).send(error);
    }
});

router.put('/:workspace_id', async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const { title } = req.body;
    console.log(req.body)
    console.log("Title:", title);
    console.log("Workspace ID:", workspace_id);
    const workspace = new Workspace();
    try {
        const result = await workspace.updateWorkspace(workspace_id, title);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error updating workspace:", error);
        res.status(500).send(error);
    }
});

module.exports = router;