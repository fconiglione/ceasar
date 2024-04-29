const { Pool } = require('pg');
const dotenv = require('dotenv');
const { user } = require('pg/lib/defaults');

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class Workspace {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getWorkspacesByUserId (user_id) {
        const query = `SELECT * FROM ceasar.workspaces WHERE user_id = $1`;
        const values = [user_id];
        try {
            const { rows } = await this.pool.query(query, values);
            console.log(rows);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}

module.exports = Workspace;