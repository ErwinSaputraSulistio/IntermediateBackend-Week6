const db = require('../configs/db')

// create
exports.newUpcomingData = (newData) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO upcoming_movies SET ?', newData, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// read
exports.getAllUpcomingData = () => {
  return new Promise((resolve, reject) => {
      db.query('SELECT * FROM upcoming_movies ORDER BY upcomingName ASC', (err, result) => {
        result.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
        if (!err) { resolve(result) } else { reject(err) }
      })
    })
  }
exports.getUpcomingDataById = (upcomingId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM upcoming_movies WHERE upcomingId = ?', upcomingId, (err, result) => {
      result.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
exports.getUpcomingDataPerPage = (queryPages, queryLimits) => {
  const calcPaginationLogics = queryPages * queryLimits - queryLimits
  let inputLimitOrNot = ''
  let inputOffsetOrNot = ''
  queryPages !== 0 ? (inputLimitOrNot += 'LIMIT ' + queryLimits + ' ') && (inputOffsetOrNot += 'OFFSET ' + calcPaginationLogics) : null
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM upcoming_movies ORDER BY updatedAt DESC ' + inputLimitOrNot + inputOffsetOrNot + ';', (err, result) => {
      if (!err && result.length !== 0) { resolve(result) } else if (result.length === 0) { resolve('More film coming soon ~') } else { reject(err) }
    })
  })
}
exports.getUpcomingNameBySearch = (searchedFilmName) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM upcoming_movies WHERE upcomingName like '%" + searchedFilmName + "%' ORDER BY updatedAt DESC", (err, result) => {
      if (result.length !== 0) { resolve(result) } else { reject(new Error('Judul film yang dicari tidak ditemukan!')) }
    })
  })
}
exports.getUpcomingBySortGenre = (sortByGenre) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM upcoming_movies WHERE upcomingGenre like '%" + sortByGenre + "%' ORDER BY upcomingName ASC", (err, result) => {
      if (result.length !== 0) { resolve(result) } else { reject(new Error('Penyortiran gagal, tidak ditemukan film dengan genre tersebut!')) }
    })
  })
}

// update
exports.changeUpcomingData = (changeData, ticketID) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE upcoming_movies SET ? WHERE upcomingId = ?', [changeData, ticketID], (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// delete
exports.removeUpcomingData = (ticketID) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM upcoming_movies WHERE upcomingId = ?', ticketID, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
