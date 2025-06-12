const mysql = require('mysql2/promise');
const config = require('../../config/elsparkcyklar.json');

const pool = mysql.createPool(config);

console.log('Connected to MySQL pool');
module.exports = pool;