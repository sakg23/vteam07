const connectToDatabase = require('./../db/connection');

// Hämta alla användare
async function getUsers() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM users');
    await db.end();
    return rows;
}

// Lägg till ny användare (enkel version, utöka för lösenord/OAuth om du vill)
async function addUser(email, name, phone, role = 'customer') {
    const db = await connectToDatabase();
    await db.query(
        'INSERT INTO users (email, name, phone, role) VALUES (?, ?, ?, ?)',
        [email, name, phone, role]
    );
    await db.end();
}

module.exports = { getUsers, addUser };
