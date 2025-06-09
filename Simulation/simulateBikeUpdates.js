const { Server } = require("socket.io");
const io = new Server(5001, {
  cors: { origin: "*" }
});

console.log("Socket server running on port 5001");

// Fake in-memory list of scooters with movement vector (dx/dy)
let scooters = [
  { id: 1, lat: 59.3293, long: 18.0686, dx: 0.00005, dy: 0.00007 },
  { id: 2, lat: 59.3301, long: 18.0692, dx: -0.00006, dy: 0.00005 },
  { id: 3, lat: 59.3310, long: 18.0700, dx: 0.00003, dy: -0.00004 },
  { id: 4, lat: 59.3321, long: 18.0690, dx: -0.00002, dy: -0.00003 },
  { id: 5, lat: 59.3300, long: 18.0675, dx: 0.00001, dy: 0.00002 },
  { id: 6, lat: 59.3305, long: 18.0688, dx: -0.00001, dy: 0.00003 },
  { id: 7, lat: 59.3315, long: 18.0695, dx: 0.00002, dy: -0.00002 },
  { id: 8, lat: 59.3320, long: 18.0680, dx: 0.00004, dy: 0.00004 },
  { id: 9, lat: 59.3330, long: 18.0705, dx: -0.00003, dy: -0.00003 },
  { id: 10, lat: 59.3285, long: 18.0670, dx: 0.00002, dy: 0.00001 },
  { id: 11, lat: 59.3299, long: 18.0699, dx: -0.00002, dy: 0.00002 },
];

setInterval(() => {
  scooters = scooters.map((scooter) => {
    const newLat = parseFloat((scooter.lat + scooter.dx).toFixed(6));
    const newLong = parseFloat((scooter.long + scooter.dy).toFixed(6));

    io.emit("bike_position_update", {
      bike_id: scooter.id,
      latitude: newLat,
      longitude: newLong,
    });

    console.log(`🚴 Scooter ${scooter.id}: ${newLat}, ${newLong}`);

    return {
      ...scooter,
      lat: newLat,
      long: newLong,
    };
  });
}, 3000); // update every 10 seconds
