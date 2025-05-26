// src/city.js
const connectToDatabase = require('./../db/connection');

// Lägg till ny stad via lagrad procedur
async function addCity(name, region) {
    const db = await connectToDatabase();
    await db.query('CALL insert_city(?, ?)', [name, region]);
    await db.end();
}

// Hämta alla städer
async function getCities() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM cities');
    await db.end();
    return rows;
}

module.exports = { getCities, addCity };
