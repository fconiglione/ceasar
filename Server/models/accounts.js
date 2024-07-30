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
        const query = `SELECT account_id, sub, name, division, phone_number, email, account_type_id, photo_url, source, created_at, updated_at FROM ceasar.accounts WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createAccount (workspace_id, sub, name, division, phone_number, email, account_type_id, photo_url, source, created_at, updated_at) {
        const query = `INSERT INTO ceasar.accounts (workspace_id, sub, name, division, phone_number, email, account_type_id, photo_url, source, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
        const values = [workspace_id, sub, name, division, phone_number, email, account_type_id, photo_url, source, created_at, updated_at];
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

    async updateAccount (workspace_id, name, division, phone_number, email, account_type_id, photo_url, source, updated_at, account_id) {
        const query = `UPDATE ceasar.accounts SET name = $2, phone_number = $3, email = $4, account_type_id = $5, photo_url = $6, source = $7, updated_at = $8, division = $9 WHERE workspace_id = $1 AND account_id = $10`;
        const values = [workspace_id, name, phone_number, email, account_type_id, photo_url, source, updated_at, division, account_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getAccountsCount (workspace_id) {
        const query = `SELECT COUNT(account_id) FROM ceasar.accounts WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Accounts;