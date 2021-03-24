// require
const express = require('express')
const router = express.Router()
const ticketDataController = require('../controllers/ticketData')
const jwtCheck = require('../functions/authenticateJWT')
const checkUserRole = require('../functions/checkUserRole')
const {uploadMovieImg} = require('../functions/multer')
const { takeAllRedisMovieTicketData, takeRedisMovieTicketDataByID, removeRedisMovieTicketDataByID } = require('../functions/redis')

// router
router
  .post('/', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg.single('movieImg'), ticketDataController.createTicketData)
  .get('/', ticketDataController.readTicketDataPerPage)
  .get('/all', takeAllRedisMovieTicketData, ticketDataController.readAllTicketData)
  .get('/:id', takeRedisMovieTicketDataByID, ticketDataController.readTicketDataById)
  .put('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg.single('movieImg'), ticketDataController.updateTicketData)
  .delete('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, removeRedisMovieTicketDataByID, ticketDataController.deleteTicketData)

// exports
module.exports = router
