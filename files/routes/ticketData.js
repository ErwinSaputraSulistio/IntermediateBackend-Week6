// require
const express = require('express')
const router = express.Router()
const ticketDataController = require('../controllers/ticketData')
const jwtCheck = require('../functions/authenticateJWT')
const checkUserRole = require('../functions/checkUserRole')
const { uploadMovieImg } = require('../functions/multer')
// const { takeAllRedisMovieTicketData, takeRedisMovieTicketDataByID, removeRedisMovieTicketDataByID, removeAllRedisMovieTicketData } = require('../functions/redis')

// router
router
  .post('/', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg, ticketDataController.createTicketData)
  .get('/', ticketDataController.readTicketDataPerPage)
  .get('/all', ticketDataController.readAllTicketData)
  .get('/:id', ticketDataController.readTicketDataById)
  .put('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, uploadMovieImg, ticketDataController.updateTicketData)
  .delete('/:id', jwtCheck.verifyJwtToken, checkUserRole.checkAdmin, ticketDataController.deleteTicketData)

// exports
module.exports = router
