const mysql = require('mysql2/promise');
const config = require('../../config/elsparkcyklar.json');

async function connectToDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || config.host,
        user: process.env.DB_USER || config.user,
        password: process.env.DB_PASSWORD || config.password,
        database: process.env.DB_NAME || config.database,
    });

    console.log(`Connected to MySQL database at ${process.env.DB_HOST || config.host}`);
    return connection;
}

module.exports = connectToDatabase;
