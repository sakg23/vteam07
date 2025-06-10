const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    req.logout(() => {
        res.redirect('/login?message=logged_out');
    });
});

module.exports = router;
