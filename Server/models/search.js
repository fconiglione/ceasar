const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Search {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getWorkspacesBySearchTerm (searchTerm, sub) {
        const query = `SELECT workspace_id, title, created_at, last_opened_at FROM ceasar.workspaces WHERE title ILIKE '%' || $1 || '%'  AND sub = $2`;
        const values = [searchTerm, sub];
        try {
            const { rows } = await this.pool.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Search;