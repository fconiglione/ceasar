const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Leads {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getLeadsByWorkspaceId (workspace_id) {
        const query = `SELECT lead_id, sub, title, first_name, last_name, lead_status_id, photo_url, company, phone_number, email, source, created_at, updated_at FROM ceasar.leads WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createLead (workspace_id, sub, title, first_name, last_name, lead_status_id, photo_url, company, phone_number, email, source, created_at, updated_at) {
        const query = `INSERT INTO ceasar.leads (workspace_id, sub, title, first_name, last_name, lead_status_id, photo_url, company, phone_number, email, source, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
        const values = [workspace_id, sub, title, first_name, last_name, lead_status_id, photo_url, company, phone_number, email, source, created_at, updated_at];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteLead (lead_id) {
        const query = `DELETE FROM ceasar.leads WHERE lead_id = $1`;
        const values = [lead_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async updateLead (lead_id, photo_url, first_name, last_name, phone_number, email, company, status_id, description) {
        const query = `UPDATE ceasar.leads SET photo_url = $2, first_name = $3, last_name = $4, phone_number = $5, email = $6, company = $7, status_id = $8, description = $9 WHERE lead_id = $1`;
        const values = [lead_id, photo_url, first_name, last_name, phone_number, email, company, status_id, description];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getActiveLeadsCount (workspace_id) {
        const query = `SELECT COUNT(lead_id) FROM ceasar.leads WHERE workspace_id = $1 AND (status_id = 1 OR status_id = 2 OR status_id = 3)`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Leads;