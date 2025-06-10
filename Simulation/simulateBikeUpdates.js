const { Server } = require("socket.io");
const io = new Server(5001, {
  cors: { origin: "*" },
});

console.log("Socket server running on port 5001");

let scooters = [];

const cityPositions = {
  "Karlskrona": { lat: 56.1612, long: 15.5869 },
  "Göteborg": { lat: 57.7089, long: 11.9746 },
  "Stockholm": { lat: 59.3293, long: 18.0686 },
};

// Function to create N scooters dynamically
function createScooters(count) {
  scooters = [];

  const perCity = Math.floor(count / 3);
  let scooterId = 1;

  // Helper to add scooters for a given city
  const addScootersForCity = (cityName, number) => {
    const base = cityPositions[cityName];
    for (let i = 0; i < number; i++) {
      scooters.push({
        id: scooterId++,
        lat: base.lat + (Math.random() * 0.005) / 3, // divide by 3 as requested
        long: base.long + (Math.random() * 0.005) / 3,
        dx: ((Math.random() - 0.5) * 0.0001) / 3, // also divide by 3 for smoother movement
        dy: ((Math.random() - 0.5) * 0.0001) / 3,
      });
    }
  };

  addScootersForCity("Karlskrona", perCity);
  addScootersForCity("Göteborg", perCity);
  addScootersForCity("Stockholm", count - perCity * 2); // remaining scooters in Stockholm

  console.log(
    `Created ${scooters.length} scooters: ${perCity} in Karlskrona, ${perCity} in Göteborg, ${count - perCity * 2} in Stockholm`
  );
}

// Function to start simulation
function startSimulation(count) {
  createScooters(count);

  setInterval(() => {
    scooters = scooters.map((scooter) => {
      const newLat = parseFloat((scooter.lat + scooter.dx).toFixed(6));
      const newLong = parseFloat((scooter.long + scooter.dy).toFixed(6));

      // Emit new absolute position
      io.emit("bike_position_update", {
        bike_id: scooter.id,
        latitude: newLat,
        longitude: newLong,
      });

      console.log(`🚴 Scooter ${scooter.id}: lat ${newLat}, long ${newLong}`);

      return {
        ...scooter,
        lat: newLat,
        long: newLong,
      };
    });
  }, 3000);
}

// Example usage:
startSimulation(1000);
