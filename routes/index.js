const express = require('express');
const { getStatus, getStats } = require('../controllers/AppController');
const { postNew, getMe } = require('../controllers/UsersController');
const { getConnect, getDisconnect } = require('../controllers/AuthController');

const router = express.Router();

// app routes
router.get('/', (req, res) => res.send('Hi, this is a file manager.'));
router.get('/status', (req, res) => getStatus(req, res));
router.get('/stats', (req, res) => getStats(req, res));

// user routes
router.post('/users', (req, res) => postNew(req, res));
router.get('/users/me', (req, res) => getMe(req, res));

// auth routes
router.get('/connect', (req, res) => getConnect(req, res));
router.get('/disconnect', (req, res) => getDisconnect(req, res));

module.exports = router;
