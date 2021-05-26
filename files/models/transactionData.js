const db = require('../configs/db')

// create
exports.newTransactionData = (newData) => {
  const {transactionId, userId, ticketId, showDate, startTime, seatPosition, howManyTickets, cinemaName, cinemaUrl, totalPrice} = newData
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO transaction_data(transaction_id, ticket_id, user_id, show_date, start_time, seat_position, how_many_tickets, \
            created_at, updated_at, cinema_url, ticket_status, total_price, cinema_name) VALUES('" + transactionId + "','" + ticketId 
            + "','" + userId + "','" + showDate + "','" + startTime + "','" + seatPosition + "','" + howManyTickets + "',current_timestamp, current_timestamp, '" 
            + cinemaUrl + "','pending','" + totalPrice + "','" + cinemaName + "')", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
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
    db.query("SELECT transaction_id, cinema_name, showing_movies.ticket_id, realname AS ticket_buyer, movie_name AS choosen_movie, \
              DATE(show_date) AS to_date, start_time, end_time, seat_position, how_many_tickets, \
              ticket_price * how_many_tickets AS total_payment FROM transaction_data \
              INNER JOIN user_data ON user_data.userid = transaction_data.user_id \
              INNER JOIN showing_movies ON showing_movies.ticket_id = transaction_data.ticket_id \
              ORDER BY transaction_data.updated_at DESC " + inputLimitOrNot + inputOffsetOrNot + ';', (err, result) => {
      if (!err && result.rows.length !== 0) { resolve(result.rows) } else if (result.rows.length === 0) { resolve('Ups! Sepertinya sudah tidak ada transaksi lainnya, nih!') } else { reject(err) }
    })
  })
}
exports.getTransactionDataByTransactionId = (transaction_id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT transaction_id, showing_movies.ticket_id, realname AS ticket_buyer, useremail AS buyer_email, phonenumber, movie_name AS choosen_movie, DATE(show_date) AS to_date, \
                start_time, end_time, seat_position, how_many_tickets, cinema_name, cinema_url, ticket_status, ticket_price * how_many_tickets AS total_payment FROM transaction_data \
                INNER JOIN user_data ON user_data.userid = transaction_data.user_id \
                INNER JOIN showing_movies ON showing_movies.ticket_id = transaction_data.ticket_id \
                WHERE transaction_id = '" + transaction_id + "'", (err, result) => {
                  console.log(err)
                  console.log(result.rows)
      result.rows.length === 0 && reject('Transaksi dengan serial number ID yang dicari tidak dapat ditemukan!')
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
exports.getTransactionDataByBuyerId = (buyerId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT transaction_id, showing_movies.ticket_id, realname AS ticket_buyer, showing_movies.ticket_id, movie_name AS choosen_movie, DATE(show_date) AS to_date, \
                start_time, end_time, seat_position, how_many_tickets, cinema_name, cinema_url, ticket_status, ticket_price * how_many_tickets AS total_payment, transaction_data.created_at FROM transaction_data \
                INNER JOIN user_data ON user_data.userid = transaction_data.user_id \
                INNER JOIN showing_movies ON showing_movies.ticket_id = transaction_data.ticket_id \
                WHERE transaction_data.user_id = '" + buyerId + "' ORDER BY transaction_data.created_at DESC", (err, result) => {
      console.log(result.rows)
      result.rows.length === 0 && reject('Transaksi dengan user ID yang dicari sebagai pembeli tidak dapat ditemukan!')
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// update
exports.changeTransactionData = (changeData, transactionID) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE transaction_data SET ? WHERE transaction_id = ?', [changeData, transactionID], (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// verify payment
exports.verifyTransactionPayment = (verifyPaymentData, transactionID) => {
  const { buyerName, buyerEmail, buyerPhoneNumber, paymentMethod } = verifyPaymentData
  return new Promise((resolve, reject) => {
    db.query("UPDATE transaction_data SET buyer_name = '" + buyerName + "', buyer_email = '" + buyerEmail + "', \
              buyer_phone_number = '" + buyerPhoneNumber + "', payment_method = '" + paymentMethod + "', ticket_status = 'active' WHERE transaction_id = '" + transactionID + "'",
              (err,result) => { if (!err) { resolve(result.rows) } else { reject(err) } })
  })
}

// delete
exports.removeTransactionData = (transactionID) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM transaction_data WHERE transaction_id = '" + transactionID + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
