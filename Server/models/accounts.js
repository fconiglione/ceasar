const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Accounts {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getAccountsByWorkspaceId (workspace_id) {
        const query = `SELECT photo_url, account_id, type_id, account_name, phone_number, email, source, description, creation_date FROM ceasar.accounts WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createAccount (workspace_id, account_name, phone_number, email, source, description, type_id) {
        const query = `INSERT INTO ceasar.accounts (workspace_id, account_name, phone_number, email, source, description, type_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [workspace_id, account_name, phone_number, email, source, description, type_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteAccount (account_id) {
        const query = `DELETE FROM ceasar.accounts WHERE account_id = $1`;
        const values = [account_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Accounts;