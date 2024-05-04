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

    async getWorkspacesByUserId (user_id) {
        const query = `SELECT * FROM ceasar.workspaces WHERE user_id = $1`;
        const values = [user_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createWorkspace (user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, creation_date) {
        
        const query = `INSERT INTO ceasar.workspaces (user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, creation_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const values = [user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts, creation_date];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteWorkspace (workspace_id, user_id) {
        const query = `DELETE FROM ceasar.workspaces WHERE workspace_id = $1 AND user_id = $2`;
        const values = [workspace_id, user_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async updateWorkspace (workspace_id, title, user_id) {
        const query = `UPDATE ceasar.workspaces SET title = $2 WHERE workspace_id = $1 AND user_id = $3`;
        const values = [workspace_id, title, user_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getWorkspacesByWorkspaceId (workspace_id, user_id) {
        const query = `SELECT title FROM ceasar.workspaces WHERE workspace_id = $1 AND user_id = $2`;
        const values = [workspace_id, user_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Workspace;