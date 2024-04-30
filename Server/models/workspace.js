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
            console.log(rows);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createWorkspace (user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts) {
        
        const query = `INSERT INTO ceasar.workspaces (user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        const values = [user_id, title, description, has_leads, has_accounts, has_opportunities, has_reports, has_files, has_contacts];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteWorkspace (workspace_id) {
        const query = `DELETE FROM ceasar.workspaces WHERE workspace_id = $1`; // Later add user_id to the query for security
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async updateWorkspace (workspace_id, title) {
        const query = `UPDATE ceasar.workspaces SET title = $2 WHERE workspace_id = $1`; // Later add user_id to the query for security
        const values = [workspace_id, title];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Workspace;