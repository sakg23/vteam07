const connectToDatabase = require('../db/connection');

// Lägg till ny användare
async function addUser(email, password_hash, name, phone, role) {
    const db = await connectToDatabase();
    try {
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)',
            [email, password_hash, name, phone, role]
        );
        return result;
    } catch (error) {
        return { error: error.message };
    } finally {
        await db.end();
    }
}

// Hämta alla användare
async function getUsers() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM users');
    await db.end();
    return rows;
}
    

// Hämta användare via id
async function getUserById(id) {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    await db.end();
    return rows;
}

// Hämta användare via e-post
async function getUserByEmail(email) {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    await db.end();
    return rows;
}
// Radera användare
async function deleteUser(id) {
    const db = await connectToDatabase();
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    await db.end();
}

// Funktion för att uppdatera användarens saldo
async function updateBalance(userId, amount) {
  let db = await connectToDatabase(); // Skapa anslutning till databasen
  try {
    let sql = `
            UPDATE users
            SET balance = balance + ?
            WHERE id = ?;
        `;

    // Kör SQL-frågan med parametrar
    await db.execute(sql, [amount, userId]);
  } catch (error) {
    console.error("Error updating balance:", error);
    throw error; // Rethrow för att hantera felet högre upp i kedjan
  } finally {
    if (db) {
      await db.end(); // Stäng anslutningen
    }
  }
}


module.exports = {
    addUser,
    getUsers,
    getUserById,
    deleteUser,
    getUserByEmail,
    updateBalance
};
