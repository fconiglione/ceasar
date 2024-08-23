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
        const query = `SELECT resource_type, public_id, folder_id, file_id, workspace_id, name, file_url, created_at, updated_at, sub, size, type, description FROM ceasar.files WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async uploadFileToDatabase (workspace_id, name, file_url, sub, size, type, public_id, resource_type, created_at) {
        const query = `INSERT INTO ceasar.files (workspace_id, name, file_url, sub, size, type, public_id, resource_type, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        const values = [workspace_id, name, file_url, sub, size, type, public_id, resource_type, created_at];
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

    async getFoldersByWorkspaceId (workspace_id) {
        const query = `SELECT folder_id, parent_folder_id, sub workspace_id, name, created_at, updated_at FROM ceasar.folders WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateFile (workspace_id, name, description, updated_at, file_id, sub) {
        const query = `UPDATE ceasar.files SET name = $2, description = $3, updated_at = $4 WHERE workspace_id = $1 AND file_id = $5 AND sub = $6`;
        const values = [workspace_id, name, description, updated_at, file_id, sub];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async createFolder (workspace_id, parent_folder_id, sub, name, created_at) {
        const query = `INSERT INTO ceasar.folders (workspace_id, parent_folder_id, sub, name, created_at) VALUES ($1, $2, $3, $4, $5)`;
        const values = [workspace_id, parent_folder_id, sub, name, created_at];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Files;