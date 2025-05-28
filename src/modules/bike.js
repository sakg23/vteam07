const connectToDatabase = require('./../db/connection');

// Lägg till scooter
async function addScooter(serial_number, city_id, latitude, longitude) {
    const db = await connectToDatabase();
    try {
        const [result] = await db.query(
            'CALL insert_scooter(?, ?, ?, ?)',
            [serial_number, city_id, latitude, longitude]
        );
        return result;
    } catch (error) {
        return { error: error.message };
    } finally {
        await db.end();
    }
}

// Hämta alla scooters
async function getScooters() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM bikes');
    await db.end();
    return rows;
}

// Hämta via serienummer
async function getScooterBySerial(serial_number) {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM bikes WHERE serial_number = ?', [serial_number]);
    await db.end();
    return rows;
}

// Ta bort scooter
async function deleteScooter(serial_number) {
    const db = await connectToDatabase();
    await db.query('DELETE FROM bikes WHERE serial_number = ?', [serial_number]);
    await db.end();
}

module.exports = {
    addScooter,
    getScooters,
    getScooterBySerial,
    deleteScooter
};
