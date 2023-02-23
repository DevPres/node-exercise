const { Pool } = require("pg");

// Hear i'm connecting to db and exporting a static method to do queries
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432")
});


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
