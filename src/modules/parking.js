const connectToDatabase = require('./../db/connection');

// Lägg till ny parkeringszon via lagrad procedur
async function addParkingZone(name, city_id, type) {
    const db = await connectToDatabase();
    await db.query('CALL insert_parking_zone(?, ?, ?)', [name, city_id, type]);
    await db.end();
}

// Hämta alla parkeringszoner
async function getParkingZones() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM parking_zones');
    await db.end();
    return rows;
}

module.exports = { getParkingZones, addParkingZone };
