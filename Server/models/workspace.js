const { Pool } = require('pg');
const dotenv = require('dotenv');
const { user } = require('pg/lib/defaults');

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Workspace {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getWorkspacesBySub (sub) {
        const query = `SELECT * FROM ceasar.workspaces WHERE sub = $1`;
        const values = [sub];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createWorkspace (sub, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, created_at) {
        const query = `INSERT INTO ceasar.workspaces (sub, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const values = [sub, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, created_at];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteWorkspace (workspace_id, sub) {
        const query = `DELETE FROM ceasar.workspaces WHERE workspace_id = $1 AND sub = $2`;
        const values = [workspace_id, sub];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async updateWorkspace (workspace_id, title, sub) {
        const query = `UPDATE ceasar.workspaces SET title = $2 WHERE workspace_id = $1 AND sub = $3`;
        const values = [workspace_id, title, sub];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getWorkspacesByWorkspaceId (workspace_id, sub) {
        const query = `SELECT title FROM ceasar.workspaces WHERE workspace_id = $1 AND sub = $2`;
        const values = [workspace_id, sub];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows[0].title;
        } catch (error) {
            throw error;
        }
    }

    async updateLastOpenedDate (workspace_id, sub, last_opened_date) {
        const query = `UPDATE ceasar.workspaces SET last_opened_at = $3 WHERE workspace_id = $1 AND sub = $2`;
        const values = [workspace_id, sub, last_opened_date];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getWorkspaceFeatures(workspace_id, sub) {
        const query = `SELECT 
                            CASE WHEN has_leads IS TRUE THEN TRUE ELSE FALSE END AS has_leads,
                            CASE WHEN has_accounts IS TRUE THEN TRUE ELSE FALSE END AS has_accounts,
                            CASE WHEN has_opportunities IS TRUE THEN TRUE ELSE FALSE END AS has_opportunities,
                            CASE WHEN has_reports IS TRUE THEN TRUE ELSE FALSE END AS has_reports,
                            CASE WHEN has_files IS TRUE THEN TRUE ELSE FALSE END AS has_files,
                            CASE WHEN has_contacts IS TRUE THEN TRUE ELSE FALSE END AS has_contacts
                        FROM ceasar.workspaces 
                        WHERE workspace_id = $1 AND sub = $2`;
        const values = [workspace_id, sub];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    async updateWorkspaceFeatures(workspace_id, sub, has_leads, has_accounts, has_opportunities, has_contacts, has_files, has_reports) {
        const query = `
            UPDATE ceasar.workspaces 
            SET has_leads = $3, has_accounts = $4, has_opportunities = $5, has_reports = $6, has_files = $7, has_contacts = $8
            WHERE workspace_id = $1 AND sub = $2
            RETURNING has_leads, has_accounts, has_opportunities, has_contacts, has_files, has_reports`;
        const values = [workspace_id, sub, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    
}

module.exports = Workspace;