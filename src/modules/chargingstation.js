const connectToDatabase = require('./../db/connection');

// Lägg till ny laddstation via lagrad procedur
async function addChargingStation(name, city_id, latitude, longitude) {
    const db = await connectToDatabase();
    try {
        const [result] = await db.query(
            'CALL insert_charging_station(?, ?, ?, ?)',
            [name, city_id, latitude, longitude]
        );
        return result;
    } catch (error) {
        return { error: error.message };
    } finally {
        await db.end();
    }
}
// Hämta alla laddstationer
async function getChargingStations() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM stations');
    await db.end();
    return rows;
}

async function deleteChargingStation(name) {
    const db = await connectToDatabase();
    await db.query('DELETE FROM stations WHERE name = ?', [name]);
    await db.end();
}

async function getChargingStationName(name) {
    const db = await connectToDatabase();
    const [station] = await db.query('SELECT * FROM stations WHERE name = ?', [name]);
    await db.end();
    return station;

}





module.exports = { getChargingStations, addChargingStation, deleteChargingStation, getChargingStationName };
