const express = require('express');
const connectToDatabase = require('./src/db/connection')
const path = require('path');
const city = require('./src/city');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('database/index')
})

app.get('/cities', async (req, res) => {
    try {
        const cities = await city.getCities();
        let selectedCity = null;
        const cityId = req.query.cityId;

        // Om någon stad är vald via querystring (?cityId=2)
        if (cityId) {
            selectedCity = cities.find(c => c.id == cityId);
        }

        res.render('database/cities', { cities, selectedCity });
    } catch (err) {
        res.render('database/cities', { cities: [], selectedCity: null });
    }
});

app.post('/cities', async (req, res) => {
    try {
        const { name, region } = req.body;
        await city.addCity(name, region); // Din metod i city.js
        res.redirect('/cities');
    } catch (err) {
        res.status(500).send('Kunde inte lägga till stad');
    }
});


app.get('/cities/new', (req, res) => {
    res.render('database/city_new');
});

app.get('/admin/dashboard', async (req, res) => {
    try {
        const db = await connectToDatabase(); // <-- DENNA RAD SAKNAS!
        // Hämta statistik från databasen
        const [customers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role="customer"');
        const [scooters] = await db.query('SELECT COUNT(*) as count FROM bikes WHERE status="in_use"');
        const [trips] = await db.query('SELECT COUNT(*) as count FROM rides');
        const [allBikes] = await db.query('SELECT id, status, battery_level, last_ride_id FROM bikes LIMIT 10');
        const [zones] = await db.query('SELECT id, name FROM parking_zones');

        await db.end(); // <-- glöm inte att stänga anslutningen

        res.render('admin/dashboard', {
            overview: {
                customers: customers[0].count,
                scooters: scooters[0].count,
                trips: trips[0].count,
            },
            bikes: allBikes,
            zones: zones
        });
    } catch (err) {
        console.error("Fel i /admin/dashboard:", err);
        res.status(500).send('Fel vid laddning av admin-sidan');
    }
});

app.listen(PORT, () => {
    console.log(`Server lyssnar på http://localhost:${PORT}`);
});

