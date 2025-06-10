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

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set EJS and views path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sessions & Passport
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Google Auth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const user = {
    id: 1, // mocked user
    displayName: profile.displayName || "Google User"
  };
  return done(null, user);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Helper: ensure authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Routes
app.get("/login", (req, res) => {
  res.render("database/login", { query: req.query });
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/customer")
);

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/login?message=logged_out");
  });
});

app.get("/customer", ensureAuth, (req, res) => {
  res.render("database/customer", {
    user: req.user,
    query: req.query
  });
});

app.post("/rent/:scooterId", ensureAuth, async (req, res) => {
  const scooterId = req.params.scooterId;
  const userId = req.user.id;
  try {
    await db.execute("CALL rent_scooter(?, ?)", [userId, scooterId]);
    res.redirect("/customer?message=success");
  } catch (err) {
    console.error("Error renting scooter:", err);
    res.status(500).send("Failed to rent scooter.");
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

// 404
app.use((req, res) => {
  res.status(404).json({ error: { message: "Not found" } });
});

// Start server
const port = process.env.PORT || 5000;
http.createServer(app).listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});

const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000", // React app URL
  credentials: true
}));