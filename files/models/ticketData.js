const db = require('../configs/db')

// create
exports.newTicketData = (newData) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO ticket_data SET ?', newData, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// read
exports.getAllTicketData = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM ticket_data ORDER BY movieName ASC', (err, result) => {
      result.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
exports.getTicketDataById = (ticketId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM ticket_data WHERE ticketId = ?', ticketId, (err, result) => {
      result.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
exports.getTicketDataPerPage = (queryPages, queryLimits) => {
  const calcPaginationLogics = queryPages * queryLimits - queryLimits
  let inputLimitOrNot = ''
  let inputOffsetOrNot = ''
  queryPages !== 0 ? (inputLimitOrNot += 'LIMIT ' + queryLimits + ' ') && (inputOffsetOrNot += 'OFFSET ' + calcPaginationLogics) : null
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM ticket_data ORDER BY updatedAt DESC ' + inputLimitOrNot + inputOffsetOrNot + ';', (err, result) => {
      if (!err && result.length !== 0) { resolve(result) } else if (result.length === 0) { resolve('More film coming soon ~') } else { reject(err) }
    })
  })
}
exports.getTicketNameBySearch = (searchedFilmName) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM ticket_data WHERE movieName like '%" + searchedFilmName + "%' ORDER BY movieName ASC LIMIT 5", (err, result) => {
      if (result.length !== 0) { resolve(result) } else { reject(new Error('Judul film yang dicari tidak ditemukan!')) }
    })
  })
}
exports.getTicketBySortGenre = (sortByGenre) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM ticket_data WHERE movieGenre like '%" + sortByGenre + "%' ORDER BY MovieName ASC", (err, result) => {
      if (result.length !== 0) { resolve(result) } else { reject(new Error('Penyortiran gagal, tidak ditemukan film dengan genre tersebut!')) }
    })
  })
}

// update
exports.changeTicketData = (changeData, ticketID) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE ticket_data SET ? WHERE ticketId = ?', [changeData, ticketID], (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// delete
exports.removeTicketData = (ticketID) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM ticket_data WHERE ticketId = ?', ticketID, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
