const router = require('express').Router();

router.post('/register', (req, res) => {
  res.send('User registered');
});

module.exports = router;
