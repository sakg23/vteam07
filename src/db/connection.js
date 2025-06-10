// const mysql = require('mysql2/promise');
// const config = require('../../config/elsparkcyklar.json');

// async function connectToDatabase() {
//     const connection = await mysql.createConnection(config);

//     console.log('Connected to MySQL database');
//     return connection;
// }

// module.exports = connectToDatabase;

const mysql = require('mysql2/promise');
const config = require('../../config/elsparkcyklar.json');

const pool = mysql.createPool(config);

console.log('Connected to MySQL pool');
module.exports = pool;