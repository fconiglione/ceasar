const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Files {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

   async getFilesByWorkspaceId (workspace_id) {
        const query = `SELECT resource_type, public_id, file_id, workspace_id, name, file_url, creation_date, user_id, size, type FROM ceasar.files WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async uploadFileToDatabase (workspace_id, name, file_url, user_id, size, type, public_id, resource_type) {
        user_id = null; // temporary null user_id
        const query = `INSERT INTO ceasar.files (workspace_id, name, file_url, user_id, size, type, public_id, resource_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [workspace_id, name, file_url, user_id, size, type, public_id, resource_type];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteFile (public_id) {
        const query = `DELETE FROM ceasar.files WHERE public_id = $1`;
        const values = [public_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Files;