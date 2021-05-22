// require
const express = require('express')
const router = express.Router()
const transactionDataController = require('../controllers/transactionData')
const jwtCheck = require('../functions/authenticateJWT')

// router
router
  .post('/', jwtCheck.verifyJwtToken, transactionDataController.createTransactionData)
  .get('/', transactionDataController.readTransactionDataPerPage)
  .get('/number/:id', transactionDataController.readTransactionDataByTransactionId)
  .get('/user/:id', transactionDataController.readTransactionDataByBuyerId)
  .put('/:id', jwtCheck.verifyJwtToken, transactionDataController.updateTransactionData)
  .put('/verify/:id', jwtCheck.verifyJwtToken, transactionDataController.verifyUserPayment)
  .delete('/:id', jwtCheck.verifyJwtToken, transactionDataController.deleteTransactionData)

// exports
module.exports = router
