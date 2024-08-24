const { Pool } = require('pg')
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME } = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASS || !DATABASE_NAME) {
  throw new Error("Database connection environment variables are not set.");
}

module.exports = new Pool({
  connectionString: `postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}/${DATABASE_NAME}?sslmode=require?sslmode=require`
});