const express = require('express');
const { getStatus, getStats } = require('../controllers/AppController');
const postNew = require('../controllers/UsersController');

const router = express.Router();

router.get('/', (req, res) => res.send('Hi, this is a file manager.'));
router.get('/status', (req, res) => getStatus(req, res));
router.get('/stats', (req, res) => getStats(req, res));
router.post('/users', (req, res) => postNew(req, res));

module.exports = router;
