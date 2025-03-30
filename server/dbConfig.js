const sql = require('mssql');
require('dotenv').config(); // Load .env variables

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Use strict comparison
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', // Use strict comparison
    },
    pool: {
        max: 10, // Max connections
        min: 0,  // Min connections
        idleTimeoutMillis: 30000 // Close idle connections after 30s
    }
};

let poolPromise = null;

const getPool = async () => {
    if (!poolPromise) {
        console.log('Creating new SQL Server connection pool...');
        poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('Connected to SQL Server');
                pool.on('error', err => {
                    console.error('SQL Server Pool Error:', err);
                    // Attempt to reconnect or handle error appropriately
                    poolPromise = null; // Reset promise to allow reconnection attempts
                });
                return pool;
            })
            .catch(err => {
                console.error('Database Connection Failed:', err);
                poolPromise = null; // Reset promise on failure
                throw err; // Re-throw error
            });
    }
    return poolPromise;
};

module.exports = {
    sql,
    getPool
};