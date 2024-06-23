const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Opportunities {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getOpportunitiesByWorkspaceId (workspace_id) {
        const query = `SELECT opportunity_id, workspace_id, user_id, title, value, account_id, creation_date, description, opportunity_status_id FROM ceasar.opportunities WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createOpportunity (workspace_id, user_id, title, value, account_id, description, opportunity_status_id) {
        const query = `INSERT INTO ceasar.opportunities (workspace_id, user_id, title, value, account_id, description, opportunity_status_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [workspace_id, user_id, title, value, account_id, description, opportunity_status_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteOpportunity (opportunity_id) {
        const query = `DELETE FROM ceasar.opportunities WHERE opportunity_id = $1`;
        const values = [opportunity_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async updateOpportunity (opportunity_id, title, value, account_id, description, opportunity_status_id) {
        const query = `UPDATE ceasar.opportunities SET title = $2, value = $3, account_id = $4, description = $5, opportunity_status_id = $6 WHERE opportunity_id = $1`;
        const values = [opportunity_id, title, value, account_id, description, opportunity_status_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getActiveOpportunitiesCount (workspace_id) {
        const query = `SELECT COUNT(opportunity_id) FROM ceasar.opportunities WHERE workspace_id = $1 AND (opportunity_status_id = 1 OR opportunity_status_id = 2 OR opportunity_status_id = 3)`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getEstimatedValue (workspace_id) {
        const query = `SELECT SUM(value) FROM ceasar.opportunities WHERE workspace_id = $1 AND (opportunity_status_id = 1 OR opportunity_status_id = 2 OR opportunity_status_id = 3)`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}

module.exports = Opportunities;