const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Contacts {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getContactsByWorkspaceId (workspace_id) {
        const query = `SELECT contact_id, photo_url, first_name, last_name, phone_number, email FROM ceasar.contacts WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createContact (sub, workspace_id, photo_url, title, first_name, last_name, phone_number, email, account_id, street_number, street_name, city, state, country, postal_code, created_at, updated_at, priority, nickname) {
        console.log(sub, workspace_id, photo_url, title, first_name, last_name, phone_number, email, account_id, street_number, street_name, city, state, country, postal_code, created_at, updated_at, priority, nickname);
        const query = `INSERT INTO ceasar.contacts (sub, workspace_id, photo_url, title, first_name, last_name, phone_number, email, account_id, street_number, street_name, city, state, country, postal_code, created_at, updated_at, priority, nickname) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`;
        const values = [sub, workspace_id, photo_url, title, first_name, last_name, phone_number, email, account_id, street_number, street_name, city, state, country, postal_code, created_at, updated_at, priority, nickname];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteContact (contact_id) {
        const query = `DELETE FROM ceasar.contacts WHERE contact_id = $1`;
        const values = [contact_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async updateContact (contact_id, photo_url, first_name, last_name, phone_number, email, company, description) {
        const query = `UPDATE ceasar.contacts SET photo_url = $2, first_name = $3, last_name = $4, phone_number = $5, email = $6, company = $7, description = $8 WHERE contact_id = $1`;
        const values = [contact_id, photo_url, first_name, last_name, phone_number, email, company, description];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getContactsCount (workspace_id) {
        const query = `SELECT COUNT(contact_id) FROM ceasar.contacts WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Contacts;