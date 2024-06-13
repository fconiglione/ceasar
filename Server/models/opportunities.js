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
        const query = `SELECT workspace_id, user_id, title, value, account_id, creation_date, description FROM ceasar.opportunities WHERE workspace_id = $1`;
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