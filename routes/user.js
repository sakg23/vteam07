const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userModules = require("../src/modules/user");
const checkAuth = require("../middleware/check-auth.js");


// Hämta alla användare
router.get("/", async (req, res) => {
    try {
        const users = await userModules.getUsers();
        res.status(200).json({
            status: "success",
            users: users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Lägg till ny användare
router.post("/add", async (req, res) => {
    try {
        const { email, password_hash, name, phone, role } = req.body;

        const existing = await userModules.getUserByEmail(email);
        if (existing.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hash = await bcrypt.hash(password_hash, 10);

        const result = await userModules.addUser(email, hash, name, phone, role);

        if (result.error) {
            return res.status(500).json({ message: "Server error", error: result.error });
        }

        res.status(200).json({
            status: "success",
            message: "User created",
            user_id: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Endpoint för inloggning av en användare
router.post("/login", async (req, res) => {
  const mail = req.body.email;
  const userPassword = req.body.password;

  try {
    // Hämta användaren baserat på e-post
    const existingUser = await userModules.getUserByEmail(mail);

    // Kontrollera om användaren existerar
    if (existingUser.length === 0) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    // Jämför lösenordet med det hashade lösenordet från databasen
    const match = await bcrypt.compare(userPassword, existingUser[0].password_hash);

    if (!match) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    // Skapa en JWT-token vid framgångsrik inloggning
    const token = jwt.sign(
      {
        email: existingUser[0].email,
        name: existingUser[0].name,
      },
      process.env.JWT_KEY, // Hemlig nyckel för att signera token
      { expiresIn: "1h" } // Tokenens giltighetstid
    );

    // Skicka tillbaka svaret med token
    return res.status(200).json({
      message: "Auth successful",
      token: token,
      user_id: existingUser[0].id,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Radera användare via e-post
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const existing = await userModules.getUserByid(id);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        await userModules.deleteUser(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/me/:email", checkAuth, async (req, res) => {
  try {
    // req.user kommer från decoded JWT-token (se din login!)
    const user = await userModules.getUserByEmail(req.params.email);
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Plocka ut bara det du vill skicka till frontend
    const { id, email, name, phone, role, balance, created_at } = user[0];
    res.status(200).json({ id, email, name, phone, role, balance, created_at });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Endpoint för att uppdatera användarens saldo
router.put("/update/balance", checkAuth, async (req, res) => {
  const userId = req.body.user_id;
  const amount = req.body.amount;

  try {
    // Kontrollera om användaren existerar
    // Först, kolla om användaren finns genom att hämta användaren med user_id
    const existingUser = await userModules.getUserById(userId);

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Uppdatera användarens saldo
    await userModules.updateBalance(userId, amount);

    res.status(200).json({ message: "Balance has been updated successfully" });
  } catch (error) {
    console.error("Error updating Balance:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
