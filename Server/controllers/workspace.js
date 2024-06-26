const express = require('express');
const router = express.Router();
const Workspace = require('../models/workspace');
const { user } = require('pg/lib/defaults');

router.post('/', async (req, res) => {
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
        return res.status(401).send("No user id available.");
    }
    const { title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, creation_date } = req.body.workspace;
    const workspace = new Workspace();
    try {
        const result = await workspace.createWorkspace(user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, creation_date);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error creating workspace:", error);
        res.status(500).send(error);
    }
});

router.delete('/:workspace_id' , async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const workspace = new Workspace();
    const user_id = req.body.user_id;
    try {
        const result = await workspace.deleteWorkspace(workspace_id, user_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error deleting workspace:", error);
        res.status(500).send(error);
    }
});

router.put('/:workspace_id', async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const { title, user_id } = req.body;
    const workspace = new Workspace();
    try {
        const result = await workspace.updateWorkspace(workspace_id, title, user_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error updating workspace:", error);
        res.status(500).send(error);
    }
});
router.post('/id/:workspace_id', async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const user_id = req.body.user_id;
    const workspace = new Workspace();
    try {
        const result = await workspace.getWorkspacesByWorkspaceId(workspace_id, user_id);
        res.status(200).send(result[0].title);
    } catch (error) {
        console.error("Error getting workspace information:", error);
        res.status(500).send(error);
    }
});

router.put('/last-opened/:workspace_id', async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const user_id = req.body.user_id;
    const last_opened_date = req.body.last_opened_date;
    const workspace = new Workspace();
    try {
        const result = await workspace.updateLastOpenedDate(workspace_id, user_id, last_opened_date);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error updating last opened workspace:", error);
        res.status(500).send(error);
    }
});

router.post('/features/:workspace_id', async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const user_id = req.body.user_id;
    const workspace = new Workspace();
    try {
        const result = await workspace.getWorkspaceFeatures(workspace_id, user_id);
        const response = {
            has_leads: result.has_leads,
            has_accounts: result.has_accounts,
            has_opportunities: result.has_opportunities,
            has_contacts: result.has_contacts,
            has_files: result.has_files,
            has_reports: result.has_reports
        };
        res.status(200).json(response);
    } catch (error) {
        console.error("Error getting workspace features:", error);
        res.status(500).send(error);
    }
});

router.put('/features/:workspace_id', async (req, res) => {
    const workspace_id = req.params.workspace_id;
    const user_id = req.body.user_id;
    const has_leads = req.body.has_leads;
    const has_accounts = req.body.has_accounts;
    const has_opportunities = req.body.has_opportunities;
    const has_contacts = req.body.has_contacts;
    const has_files = req.body.has_files;
    const has_reports = req.body.has_reports;
    const workspace = new Workspace();
    try {
        const result = await workspace.updateWorkspaceFeatures(workspace_id, user_id, has_leads, has_accounts, has_opportunities, has_contacts, has_files, has_reports);
        const response = {
            has_leads: result.has_leads,
            has_accounts: result.has_accounts,
            has_opportunities: result.has_opportunities,
            has_contacts: result.has_contacts,
            has_files: result.has_files,
            has_reports: result.has_reports
        };
        res.status(200).json(response);
    } catch (error) {
        console.error("Error updating workspace features:", error);
        res.status(500).send(error);
    }
});

module.exports = router;