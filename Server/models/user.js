const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config();

const connectionString = `postgres://${process.env.FRIM_CLOUD_DB_USER}:${process.env.FRIM_CLOUD_DB_PASSWORD}@${process.env.FRIM_CLOUD_DB_HOST}:${process.env.FRIM_CLOUD_DB_PORT}/${process.env.FRIM_CLOUD_DB_NAME}?ssl=true`;

class User {
  constructor() {
    this.pool = new Pool({
        connectionString: connectionString
      });
    }

    async getUserByJWTTokenId (token_id) {
        const query = `SELECT * FROM cloud.jwt_cloud_tokens WHERE token_id = $1`;
        const values = [token_id];
        try {
            const { rows } = await this.pool.query(query, values);
            console.log(rows);
            return rows.length > 0 ? rows[0].user_id : null;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = User;