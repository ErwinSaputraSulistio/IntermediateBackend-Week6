const transactionDataModel = require('../models/transactionData')
const { v4: uuidv4 } = require('uuid')
const statusCode = require('./status')

// create
exports.createTransactionData = (req, res) => {
  const { userId, ticketId, showDate, startTime, endTime, seatPosition, howManyTickets, cinemaName, cinemaUrl, totalPrice } = req.body
  const newData = {
    transactionId: uuidv4(),
    userId,
    ticketId,
    showDate,
    startTime,
    endTime,
    seatPosition,
    howManyTickets,
    cinemaName,
    cinemaUrl,
    totalPrice,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  transactionDataModel.newTransactionData(newData)
    .then(() => { statusCode.statRes(res, 200, 'Berhasil menambahkan transaksi baru!') })
    .catch((err) => { console.log(err) })
}

// read
exports.readTransactionDataPerPage = (req, res) => {
  const checkQuery = req.query
  const queryKeys = Object.keys(checkQuery)
  if (queryKeys.includes('page') === true && queryKeys.includes('limit') === true) {
    const queryPages = parseInt(checkQuery.page)
    const queryLimits = parseInt(checkQuery.limit)
    if (Number.isNaN(queryPages) === false && Number.isNaN(queryLimits) === false) {
      transactionDataModel.getTransactionDataPerPage(queryPages, queryLimits)
        .then((result) => {
          res.json({
            outputData: result,
            previousPage: 'localhost:2000/transactions?page=' + String(queryPages - 1) + '&limit=' + String(queryLimits),
            nextPage: 'localhost:2000/transactions?page=' + String(queryPages + 1) + '&limit=' + String(queryLimits)
          })
        })
        .catch((err) => { console.log(err) })
    } else { statusCode.queryNaN(res) }
  } else { statusCode.invalidQuery(res) }
}
exports.readTransactionDataByTransactionId = (req, res) => {
  const transactionId = req.params.id
  transactionDataModel.getTransactionDataByTransactionId(transactionId)
    .then((result) => { statusCode.statRes(res, 200, result) })
    .catch((err) => { res.status(404).json({callResult:"Failed", errorCode: 404, errorMessage: err}) })
}
exports.readTransactionDataByBuyerId = (req, res) => {
  const buyerId = req.params.id
  transactionDataModel.getTransactionDataByBuyerId(buyerId)
    .then((result) => { statusCode.statRes(res, 200, result) })
    .catch((err) => { res.status(404).json({callResult:"Failed", errorCode: 404, errorMessage: err}) })
}

// update
exports.updateTransactionData = (req, res) => {
  const transactionId = req.params.id
  const { userId, ticketId, showDate, startTime, endTime, seatPosition, howManyTickets } = req.body
  const changeData = {
    userId,
    ticketId,
    showDate,
    startTime,
    endTime,
    seatPosition,
    howManyTickets,
    updatedAt: new Date()
  }
  transactionDataModel.changeTransactionData(changeData, transactionId)
    .then(() => { statusCode.statRes(res, 201, 'Berhasil ubah data transaksi!') })
    .catch((err) => { console.log(err) })
}

// verify payment
exports.verifyUserPayment = (req, res) => {
  const transactionId = req.params.id
  const { buyerName, buyerEmail, buyerPhoneNumber, paymentMethod } = req.body
  const verifyPaymentData = {
    buyerName,
    buyerEmail,
    buyerPhoneNumber,
    paymentMethod
  }
  transactionDataModel.verifyTransactionPayment(verifyPaymentData, transactionId)
    .then(() => { statusCode.statRes(res, 201, 'Pembayaran berhasil, kini tiket dapat kamu gunakan ~') })
    .catch((err) => { console.log(err) })
}

// delete
exports.deleteTransactionData = (req, res) => {
  const transactionId = req.params.id
  transactionDataModel.removeTransactionData(transactionId)
    .then(() => { statusCode.statRes(res, 200, 'Berhasil hapus data transaksi!') })
    .catch((err) => { console.log(err) })
}
