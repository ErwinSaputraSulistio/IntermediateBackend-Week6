// require
const express = require('express')
const router = express.Router()
const upcomingDataController = require('../controllers/upcomingMovies')
const jwtCheck = require('../functions/authenticateJWT')
const checkUserRole = require('../functions/checkUserRole')
const { uploadMovieImg } = require('../functions/multer')
const { takeAllRedisUpcomingMovieData, takeRedisUpcomingMovieDataByID, removeAllRedisUpcomingMovieData, removeRedisUpcomingMovieDataByID } = require('../functions/redis')

// router
router
  .post('/', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg, upcomingDataController.createUpcomingData)
  .get('/', upcomingDataController.readUpcomingDataPerPage)
  .get('/all', takeAllRedisUpcomingMovieData, upcomingDataController.readAllUpcomingData)
  .get('/:id', takeRedisUpcomingMovieDataByID, upcomingDataController.readUpcomingDataById)
  .put('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, removeAllRedisUpcomingMovieData, removeRedisUpcomingMovieDataByID, uploadMovieImg, upcomingDataController.updateUpcomingData)
  .delete('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, removeAllRedisUpcomingMovieData, removeRedisUpcomingMovieDataByID, upcomingDataController.deleteUpcomingData)

// exports
module.exports = router
