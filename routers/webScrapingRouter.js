const express = require('express')

const router = express.Router();

const WebScrapingController = require('../controllers/WebScrapingController')

router.get('/', WebScrapingController.getOfficialLadder)

module.exports = router