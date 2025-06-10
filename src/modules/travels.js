const connectToDatabase = require('./../db/connection');

// Lägg till ny resa
async function addTravel(bike_id, user_id, start_lat, start_long) {
  const db = await connectToDatabase();
  try {
    // Start transaction
    await db.beginTransaction();

    // Insert ride via stored procedure
    const [rideResult] = await db.query(
      'CALL insert_ride(?, ?, ?, ?)',
      [bike_id, user_id, start_lat, start_long]
    );

    await db.query(
      'UPDATE bikes SET status = ? WHERE id = ?',
      ['in_use', bike_id]
    );

    // Commit transaction
    await db.commit();
    return rideResult;
  } catch (error) {
    await db.rollback();
    return { error: error.message };
  } finally {
    await db.end();
  }
}

// Hämta alla resor
async function getTravels() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM rides');
    await db.end();
    return rows;
}

// Hämta specifik resa
async function getTravelById(id) {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM rides WHERE id = ?', [id]);
    await db.end();
    return rows;
}

async function getRidesById(id) {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM rides WHERE user_id = ?', [id]);
    await db.end();
    return rows;
}

// Ta bort resa
async function deleteTravel(id) {
    const db = await connectToDatabase();
    await db.query('DELETE FROM rides WHERE id = ?', [id]);
    await db.end();
}

module.exports = {
    addTravel,
    getTravels,
    getTravelById,
    deleteTravel,
    getRidesById
};
