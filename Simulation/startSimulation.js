const { createScooters } = require('./createScooter');
const { createUsers } = require('./createUser');
const { createRidesFor } = require('./createRides');
const { startSimulation } = require('./simulateBikeUpdates');
const { addCities } = require('./addCities');


async function runSimulations() {
        console.log('Adding cities..');
        await addCities();

        console.log('Starting user creation...');
        await createUsers(1000);
        console.log('Users created\n');

        console.log('Starting scooter creation...');
        await createScooters(1000);
        console.log('Scooters created\n');

        console.log('Starting ride creation...');
        await createRidesFor(1000);
        console.log('Rides created\n');

        console.log('Starting bike simulation...');
        startSimulation(1000);
        console.log('Bike simulation started\n');
}

runSimulations();
