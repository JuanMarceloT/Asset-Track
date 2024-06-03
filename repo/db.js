const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'admin',
    port: 5439 // Default port for PostgreSQL
});

module.exports = pool;
