const express = require('express');
const router = express.Router();
const Leads = require('../models/leads');
const Contacts = require('../models/contacts');
const Accounts = require('../models/accounts');
const Opportunities = require('../models/opportunities');

// Leads

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

router.delete('/leads/:lead_id', async (req, res) => {
    const lead_id = req.params.lead_id;
    const leads = new Leads();
    try {
        const result = await leads.deleteLead(lead_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error deleting lead:", error);
        res.status(500).send(error);
    }
});

router.put('/leads/update', async (req, res) => {
    const { lead_id, photo_url, full_name, phone_number, email, company, status_id, description } = req.body.lead;
    const nameParts = full_name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const leads = new Leads();
    try {
        const result = await leads.updateLead(lead_id, photo_url, first_name, last_name, phone_number, email, company, status_id, description);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error updating lead:", error);
        res.status(500).send(error);
    }
});

// Contacts

router.post('/contacts', async (req, res) => {
    const workspace_id = req.body.workspaceId;
    const contacts = new Contacts();
    try {
        const result = await contacts.getContactsByWorkspaceId(workspace_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting contacts information:", error);
        res.status(500).send(error);
    }
});

router.post('/contacts/create', async (req, res) => {
    const { workspace_id, photo_url, full_name, phone_number, email, company, description } = req.body.contact;
    const nameParts = full_name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const contacts = new Contacts();
    try {
        const result = await contacts.createContact(workspace_id, photo_url, first_name, last_name, phone_number, email, company, description);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).send(error);
    }
});

router.put('/contacts/update', async (req, res) => {
    const { contact_id, photo_url, full_name, phone_number, email, company, description } = req.body.contact;
    const nameParts = full_name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const contacts = new Contacts();
    try {
        const result = await contacts.updateContact(contact_id, photo_url, first_name, last_name, phone_number, email, company, description);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).send(error);
    }
});

router.delete('/contacts/:contact_id', async (req, res) => {
    const contact_id = req.params.contact_id;
    const contacts = new Contacts();
    try {
        const result = await contacts.deleteContact(contact_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).send(error);
    }
});

// Accounts

router.post('/accounts', async (req, res) => {
    const workspace_id = req.body.workspaceId;
    const accounts = new Accounts();
    try {
        const result = await accounts.getAccountsByWorkspaceId(workspace_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting accounts information:", error);
        res.status(500).send(error);
    }
});

router.post('/accounts/create', async (req, res) => {
    const { workspace_id, account_name, phone_number, email, source, description, type_id } = req.body.account;
    const accounts = new Accounts();
    try {
        const result = await accounts.createAccount(workspace_id, account_name, phone_number, email, source, description, type_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).send(error);
    }
});

router.put('/accounts/update', async (req, res) => {
    const { account_id, account_name, phone_number, email, source, description, type_id } = req.body.account;
    const accounts = new Accounts();
    try {
        const result = await accounts.updateAccount(account_id, account_name, phone_number, email, source, description, type_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error updating account:", error);
        res.status(500).send(error);
    }
});

router.delete('/accounts/:account_id', async (req, res) => {
    const account_id = req.params.account_id;
    const accounts = new Accounts();
    try {
        const result = await accounts.deleteAccount(account_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).send(error);
    }
});

// Opportunities

router.post('/opportunities', async (req, res) => {
    const workspace_id = req.body.workspaceId;
    const opportunities = new Opportunities();
    try {
        const result = await opportunities.getOpportunitiesByWorkspaceId(workspace_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting opportunities information:", error);
        res.status(500).send(error);
    }
});

router.post('/opportunities/create', async (req, res) => {
    const { workspace_id, user_id, title, value, account_id, description, opportunity_status_id } = req.body.opportunity;
    const opportunities = new Opportunities();
    try {
        const result = await opportunities.createOpportunity(workspace_id, user_id, title, value, account_id, description, opportunity_status_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error creating opportunity:", error);
        res.status(500).send(error);
    }
});

router.delete('/opportunities/:opportunity_id', async (req, res) => {
    const opportunity_id = req.params.opportunity_id;
    const opportunities = new Opportunities();
    try {
        const result = await opportunities.deleteOpportunity(opportunity_id);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error deleting opportunity:", error);
        res.status(500).send(error);
    }
});

module.exports = router;