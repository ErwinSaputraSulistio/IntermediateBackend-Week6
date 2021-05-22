const express = require('express')
const router = express.Router()
const cinemaDataController = require('../controllers/cinemaData')

router.get('/all', cinemaDataController.readAllCinemaData)
module.exports = router