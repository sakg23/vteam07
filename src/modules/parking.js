const connectToDatabase = require('./../db/connection');

// Lägg till ny parkeringszon via lagrad procedur
async function addParkingZone(name, city_id, latitude, longitude, radius) {
    const db = await connectToDatabase();
    try {
        const [result] = await db.query(
            'CALL insert_parking_zone(?, ?, ?, ?, ?)',
            [name, city_id, latitude, longitude, radius]
        );
        return result;
    } catch (error) {
        return { error: error.message };
    } finally {
        await db.end();
    }
}

// Hämta alla parkeringszoner
async function getParkingZones() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM parking_zones');
    await db.end();
    return rows;
}

// Hämta zon via namn
async function getParkingZoneByName(name) {
    const db = await connectToDatabase();
    const [zone] = await db.query('SELECT * FROM parking_zones WHERE name = ?', [name]);
    await db.end();
    return zone;
}

// Radera zon via namn
async function deleteParkingZone(name) {
    const db = await connectToDatabase();
    await db.query('DELETE FROM parking_zones WHERE name = ?', [name]);
    await db.end();
}

module.exports = {
    getParkingZones,
    addParkingZone,
    getParkingZoneByName,
    deleteParkingZone
};
