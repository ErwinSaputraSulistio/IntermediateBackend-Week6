// require
const express = require('express')
const router = express.Router()
const upcomingDataController = require('../controllers/upcomingMovies')
const jwtCheck = require('../functions/authenticateJWT')
const checkUserRole = require('../functions/checkUserRole')
const { uploadMovieImg } = require('../functions/multer')
// const { takeAllRedisUpcomingMovieData, takeRedisUpcomingMovieDataByID, removeAllRedisUpcomingMovieData, removeRedisUpcomingMovieDataByID } = require('../functions/redis')

// router
router
  .post('/', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg, upcomingDataController.createUpcomingData)
  .get('/', upcomingDataController.readUpcomingDataPerPage)
  .get('/all', upcomingDataController.readAllUpcomingData)
  .get('/:id', upcomingDataController.readUpcomingDataById)
  .put('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg, upcomingDataController.updateUpcomingData)
  .delete('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, upcomingDataController.deleteUpcomingData)

// exports
module.exports = router
