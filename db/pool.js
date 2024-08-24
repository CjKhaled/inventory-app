const { Pool } = require('pg')
// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
//   throw new Error("Database connection environment variables are not set.");
// }

module.exports = new Pool({
  connectionString: `postgresql://odinproject:odin123@localhost:5432/inventory_database`
});