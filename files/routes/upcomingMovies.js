// require
const express = require('express')
const router = express.Router()
const upcomingDataController = require('../controllers/upcomingMovies')
const jwtCheck = require('../functions/authenticateJWT')
const checkUserRole = require('../functions/checkUserRole')
const {uploadMovieImg} = require('../functions/multer')
const { takeAllRedisUpcomingMovieData, takeRedisUpcomingMovieDataByID, removeRedisUpcomingMovieDataByID } = require('../functions/redis')


// router
router
  .post('/', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg.single('movieImg'), upcomingDataController.createUpcomingData)
  .get('/', upcomingDataController.readUpcomingDataPerPage)
  .get('/all', takeAllRedisUpcomingMovieData, upcomingDataController.readAllUpcomingData)
  .get('/:id', takeRedisUpcomingMovieDataByID, upcomingDataController.readUpcomingDataById)
  .put('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg.single('movieImg'), upcomingDataController.updateUpcomingData)
  .delete('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, removeRedisUpcomingMovieDataByID, upcomingDataController.deleteUpcomingData)

// exports
module.exports = router
