const connectToDatabase = require("../db/connection");

// Lägg till ny stad
async function addCity(name, region) {
    const db = await connectToDatabase();
    try {
        const [result] = await db.query('CALL insert_city(?, ?)', [name, region]);
        return result;
    } catch (error) {
        return { error: error.message };
    } finally {
        await db.end();
    }
}

// Hämta alla städer
async function getCities() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM cities');
    await db.end();
    return rows;
}

// Hämta stad via namn
async function getCityByName(name) {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM cities WHERE name = ?', [name]);
    await db.end();
    return rows;
}

// Radera stad via namn
async function deleteCity(name) {
    const db = await connectToDatabase();
    await db.query('DELETE FROM cities WHERE name = ?', [name]);
    await db.end();
}

module.exports = {
    addCity,
    getCities,
    getCityByName,
    deleteCity
};
