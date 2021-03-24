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
    db.query("SELECT transactionId, realName AS ticketBuyer, movieName AS choosenMovie, \
                DATE_FORMAT(showDate, '%d-%m-%Y') AS showDate, startTime, endTime, seatPosition, howManyTickets, \
                ticketPrice * howManyTickets AS totalPayment FROM transaction_data \
                INNER JOIN user_data ON user_data.userId = transaction_data.userId \
                INNER JOIN ticket_data ON ticket_data.ticketId = transaction_data.ticketId \
                ORDER BY transaction_data.updatedAt DESC " + inputLimitOrNot + inputOffsetOrNot + ';', (err, result) => {
      if (!err && result.length !== 0) { resolve(result) } else if (result.length === 0) { resolve('Ups! Sepertinya sudah tidak ada transaksi lainnya, nih!') } else { reject(err) }
    })
  })
}
exports.getTransactionDataById = (transactionId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT transactionId, realName AS ticketBuyer, movieName AS choosenMovie, DATE_FORMAT(showDate, '%d-%m-%Y') AS showDate, \
                startTime, endTime, seatPosition, howManyTickets, ticketPrice * howManyTickets AS totalPayment FROM transaction_data \
                INNER JOIN user_data ON user_data.userId = transaction_data.userId \
                INNER JOIN ticket_data ON ticket_data.ticketId = transaction_data.ticketId \
                WHERE transactionId = ?", transactionId, (err, result) => {
      result.length === 0 && resolve('ERROR : Transaksi dengan ID yang dicari tidak dapat ditemukan!')
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

// delete
exports.removeTransactionData = (transactionID) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM transaction_data WHERE transactionId = ?', transactionID, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
