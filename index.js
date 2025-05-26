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


// app.get('/cities/new', (req, res) => {
//     res.render('city_new');
// });

// // Lägg till ny stad
// app.post('/cities', async (req, res) => {
//     try {
//         const { name, region } = req.body;
//         await city.addCity(name, region);
//         res.redirect('/cities');
//     } catch (err) {
//         res.status(500).send('Kunde inte lägga till stad');
//     }
// });


app.listen(PORT, () => {
    console.log(`Server lyssnar på http://localhost:${PORT}`);
});
