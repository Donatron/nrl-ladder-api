const express = require('express')

const router = express.Router();

const WebScrapingController = require('../controllers/WebScrapingController')

router.get('/official-ladder', WebScrapingController.getOfficialLadder)

module.exports = router