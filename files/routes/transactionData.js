// require
const express = require('express')
const router = express.Router()
const transactionDataController = require('../controllers/transactionData')

// router
router
  .post('/', transactionDataController.createTransactionData)
  .get('/', transactionDataController.readTransactionDataPerPage)
  .get('/:id', transactionDataController.readTransactionDataById)
  .put('/:id', transactionDataController.updateTransactionData)
  .delete('/:id', transactionDataController.deleteTransactionData)

// exports
module.exports = router
