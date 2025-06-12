"use strict";
require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./src/db/connection");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const user = {
    id: 1,
    displayName: profile.displayName || "Google User"
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}


app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("http://localhost:3000/customer")
);

// Logout
app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("http://localhost:3000/login?message=logged_out");
  });
});


// Get current user
app.get("/api/me", ensureAuth, (req, res) => {
  res.json(req.user);
});

// Get scooters
app.get("/api/scooters", ensureAuth, async (req, res) => {
  const mockScooters = [
    { id: 1, lat: 57.7089, lng: 11.9746 },
    { id: 2, lat: 57.7072, lng: 11.9668 }
  ];
  res.json(mockScooters);
});

app.get("/rent/rented", ensureAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      "SELECT bike_id FROM rides WHERE user_id = ? AND end_time IS NULL",
      [userId]
    );
    if (rows.length === 0) {
      return res.json({ message: "No active rentals found." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching rented scooter:", err);
    res.status(500).json({ error: "Failed to get rented scooter" });
  }
});


// Rent scooter
app.post("/rent/:scooterId", ensureAuth, async (req, res) => {
  const scooterId = req.params.scooterId;
  const userId = req.user?.id;
  console.log("➡️ Rent request by user:", userId, "for scooter:", scooterId);

  if (!scooterId || !userId) {
    return res.status(400).json({ error: "Missing scooterId or userId" });
  }

  try {
    const [result] = await db.execute("CALL rent_scooter(?, ?)", [userId, scooterId]);
    console.log(" DB rent result:", result);
    res.status(200).json({ message: "Scooter rented successfully" });
  } catch (err) {
    console.error(" Error renting scooter:", err);
    res.status(500).json({ error: "Failed to rent scooter" });
  }
});


app.post("/return/:scooterId", ensureAuth, async (req, res) => {
  const scooterId = req.params.scooterId;
  const userId = req.user.id;
  try {
    await db.execute("CALL return_scooter(?, ?)", [userId, scooterId]);
    res.redirect("/payment");
  } catch (err) {
    console.error("Error returning scooter:", err);
    res.status(500).send("Failed to return scooter.");
  }
});


app.get("/payment", ensureAuth, (req, res) => {
  res.render("database/paymentCustomer", { amount: 50 }); // mock data
});

app.post("/payment/confirm", ensureAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    await db.execute("CALL mark_payment_complete(?)", [userId]);
    res.redirect("/customer?message=payment_success");
  } catch (err) {
    console.error("Error confirming payment:", err);
    res.status(500).send("Failed to confirm payment.");
  }
});

app.get("/login", (req, res) => {
  res.render("database/login", { query: req.query });
});

app.get("/customer", ensureAuth, (req, res) => {
  res.render("database/customer", {
    user: req.user,
    query: req.query
  });
});


app.use((req, res) => {
  res.status(404).json({ error: { message: "Not found" } });
});

const port = process.env.PORT || 5000;
http.createServer(app).listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
