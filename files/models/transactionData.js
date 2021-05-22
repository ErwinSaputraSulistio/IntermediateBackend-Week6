const db = require('../configs/db')

// create
exports.newTransactionData = (newData) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO transaction_data SET ?', newData, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// read
exports.getTransactionDataPerPage = (queryPages, queryLimits) => {
  const calcPaginationLogics = queryPages * queryLimits - queryLimits
  let inputLimitOrNot = ''
  let inputOffsetOrNot = ''
  queryPages !== 0 ? (inputLimitOrNot += 'LIMIT ' + queryLimits + ' ') && (inputOffsetOrNot += 'OFFSET ' + calcPaginationLogics) : null
  return new Promise((resolve, reject) => {
    db.query("SELECT transactionId, ticket_data.ticketId, realName AS ticketBuyer, movieName AS choosenMovie, \
                DATE_FORMAT(showDate, '%d-%m-%Y') AS showDate, startTime, endTime, seatPosition, howManyTickets, \
                ticketPrice * howManyTickets AS totalPayment FROM transaction_data \
                INNER JOIN user_data ON user_data.userId = transaction_data.userId \
                INNER JOIN ticket_data ON ticket_data.ticketId = transaction_data.ticketId \
                ORDER BY transaction_data.updatedAt DESC " + inputLimitOrNot + inputOffsetOrNot + ';', (err, result) => {
      if (!err && result.length !== 0) { resolve(result) } else if (result.length === 0) { resolve('Ups! Sepertinya sudah tidak ada transaksi lainnya, nih!') } else { reject(err) }
    })
  })
}
exports.getTransactionDataByTransactionId = (transactionId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT transactionId, ticket_data.ticketId, realName AS ticketBuyer, userEmail AS buyerEmail, phoneNumber, movieName AS choosenMovie, DATE_FORMAT(showDate, '%d-%m-%Y') AS showDate, \
                startTime, endTime, seatPosition, howManyTickets, cinemaName, cinemaUrl, ticketStatus, ticketPrice * howManyTickets AS totalPayment FROM transaction_data \
                INNER JOIN user_data ON user_data.userId = transaction_data.userId \
                INNER JOIN ticket_data ON ticket_data.ticketId = transaction_data.ticketId \
                WHERE transactionId = ?", transactionId, (err, result) => {
      result.length === 0 && reject('Transaksi dengan serial number ID yang dicari tidak dapat ditemukan!')
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
exports.getTransactionDataByBuyerId = (buyerId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT transactionId, ticket_data.ticketId, realName AS ticketBuyer, ticket_data.ticketId, movieName AS choosenMovie, DATE_FORMAT(showDate, '%d-%m-%Y') AS showDate, \
                startTime, endTime, seatPosition, howManyTickets, cinemaName, cinemaUrl, ticketStatus, ticketPrice * howManyTickets AS totalPayment, transaction_data.createdAt FROM transaction_data \
                INNER JOIN user_data ON user_data.userId = transaction_data.userId \
                INNER JOIN ticket_data ON ticket_data.ticketId = transaction_data.ticketId \
                WHERE transaction_data.userId = ? ORDER BY transaction_data.createdAt DESC", buyerId, (err, result) => {
      result.length === 0 && reject('Transaksi dengan user ID yang dicari sebagai pembeli tidak dapat ditemukan!')
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// update
exports.changeTransactionData = (changeData, transactionID) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE transaction_data SET ? WHERE transactionId = ?', [changeData, transactionID], (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// verify payment
exports.verifyTransactionPayment = (verifyPaymentData, transactionID) => {
  const { buyerName, buyerEmail, buyerPhoneNumber, paymentMethod } = verifyPaymentData
  return new Promise((resolve, reject) => {
    db.query("UPDATE transaction_data SET buyerName = '" + buyerName + "', buyerEmail = '" + buyerEmail + "', \
              buyerPhoneNumber = '" + buyerPhoneNumber + "', paymentMethod = '" + paymentMethod + "', ticketStatus = 'active' WHERE transactionId = '" + transactionID + "'",
              (err,result) => { if (!err) { resolve(result) } else { reject(err) } })
  })
}

// delete
exports.removeTransactionData = (transactionID) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM transaction_data WHERE transactionId = ?', transactionID, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
