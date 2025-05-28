const connectToDatabase = require('../db/connection');

// Lägg till ny användare
async function addUser(email, password_hash, name, phone, role) {
    const db = await connectToDatabase();
    try {
        const [result] = await db.query(
            'CALL insert_user(?, ?, ?, ?, ?)',
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
async function getUserByid(id) {
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

module.exports = {
    addUser,
    getUsers,
    getUserByid,
    deleteUser,
    getUserByEmail
};
