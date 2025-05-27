const express = require("express");
const router = express.Router();
const userModules = require('../src/modules/user');

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

module.exports = router;
