const axios = require("axios");
const bcrypt = require("bcrypt");

const API_URL = "http://localhost:5000/v1/user/add";
const ROLE = "customer"; // or 'admin'

// Fake user generator
function generateUser(index) {
  const email = `user${index}@example.com`;
  const password = `password${index}`;
  const name = `User ${index}`;
  const phone = `07000000${index.toString().padStart(2, "0")}`;
  return { email, password, name, phone, role: ROLE };
}

async function createUsers(count) {
  for (let i = 1; i <= count; i++) {
    const { email, password, name, phone, role } = generateUser(i);
    const password_hash = await bcrypt.hash(password, 10);

    const data = {
      email,
      password_hash,
      name,
      phone,
      role,
    };

    try {
      const res = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(`Created user: ${email}`);
    } catch (err) {
      console.error(`Failed to create ${email}:`, err.response?.data || err.message);
    }
  }
}

createUsers(10); // Change the number of users to create
