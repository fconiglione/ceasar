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

    async uploadFileToDatabase (workspace_id, name, file_url, sub, size, type, public_id, resource_type, created_at, folder_id) {
        const query = `INSERT INTO ceasar.files (workspace_id, name, file_url, sub, size, type, public_id, resource_type, created_at, folder_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const values = [workspace_id, name, file_url, sub, size, type, public_id, resource_type, created_at, folder_id];
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

    async updateFile (workspace_id, name, description, updated_at, file_id, sub, folder_id) {
        const query = `UPDATE ceasar.files SET name = $2, description = $3, updated_at = $4, folder_id = $7 WHERE workspace_id = $1 AND file_id = $5 AND sub = $6`;
        const values = [workspace_id, name, description, updated_at, file_id, sub, folder_id];
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

    async updateFolder (workspace_id, name, updated_at, sub, folder_id, parent_folder_id) {
        const query = `UPDATE ceasar.folders SET name = $2, updated_at = $3, parent_folder_id = $6 WHERE workspace_id = $1 AND folder_id = $5 AND sub = $4`;
        const values = [workspace_id, name, updated_at, sub, folder_id, parent_folder_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteFolder(folder_id) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
    
            // Find all folders to delete recursively
            const findFoldersQuery = `
                WITH RECURSIVE folder_tree AS (
                    SELECT folder_id
                    FROM ceasar.folders
                    WHERE folder_id = $1
                    UNION ALL
                    SELECT f.folder_id
                    FROM ceasar.folders f
                    INNER JOIN folder_tree ft ON f.parent_folder_id = ft.folder_id
                )
                SELECT folder_id FROM folder_tree;
            `;
            const { rows: foldersToDelete } = await client.query(findFoldersQuery, [folder_id]);
    
            // Extract the folder IDs to delete
            const folderIds = foldersToDelete.map(row => row.folder_id);
    
            // Delete files within the identified folders
            const deleteFilesQuery = `
                DELETE FROM ceasar.files
                WHERE folder_id = ANY($1::int[]);
            `;
            await client.query(deleteFilesQuery, [folderIds]);
    
            // Delete the folders
            const deleteFoldersQuery = `
                DELETE FROM ceasar.folders
                WHERE folder_id = ANY($1::int[]);
            `;
            await client.query(deleteFoldersQuery, [folderIds]);
    
            await client.query('COMMIT');
            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }    

    async getUsedStorage (workspace_id) {
        const query = `SELECT SUM(size) FROM ceasar.files WHERE workspace_id = $1`;
        const values = [workspace_id];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Files;