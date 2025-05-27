const connectToDatabase = require('./../db/connection');

// Lägg till ny laddstation via lagrad procedur
async function addChargingStation(name, city_id, location) {
    const db = await connectToDatabase();
    await db.query('CALL insert_charging_station(?, ?, ?)', [name, city_id, location]);
    await db.end();
}

// Hämta alla laddstationer
async function getChargingStations() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM stations');
    await db.end();
    return rows;
}

module.exports = { getChargingStations, addChargingStation };
