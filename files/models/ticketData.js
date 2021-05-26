const db = require('../configs/db')

// create
exports.newTicketData = (newData) => {
  
  const { ticketId, movieName, movieGenre, ticketPrice, releaseDate, directedBy, movieDuration, movieCasts, movieSynopsis, movieImgUrl } = newData
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO showing_movies(ticket_id, movie_name, movie_genre, ticket_price, created_at, updated_at, \
      release_date, directed_by, movie_duration, movie_casts, movie_synopsis, movie_img) VALUES('" + ticketId + "', \
      '" + movieName + "','" + movieGenre + "','" + ticketPrice + "',current_timestamp,current_timestamp,'" + releaseDate + "', \
      '" + directedBy + "','" + movieDuration + "','" + movieCasts + "','" + movieSynopsis + "','" + movieImgUrl + "')", (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// read
exports.getAllTicketData = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM showing_movies ORDER BY movie_name ASC', (err, result) => {
      result.rows.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
exports.getTicketDataById = (ticketId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM showing_movies WHERE ticket_id = '" + ticketId + "'", (err, result) => {
      result.rows.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
exports.getTicketDataPerPage = (queryPages, queryLimits) => {
  const calcPaginationLogics = queryPages * queryLimits - queryLimits
  let inputLimitOrNot = ''
  let inputOffsetOrNot = ''
  queryPages !== 0 ? (inputLimitOrNot += 'LIMIT ' + queryLimits + ' ') && (inputOffsetOrNot += 'OFFSET ' + calcPaginationLogics) : null
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM showing_movies ORDER BY updated_at DESC ' + inputLimitOrNot + inputOffsetOrNot, (err, result) => {
      if (!err && result.rows.length !== 0) { resolve(result.rows) } else if (result.rows.length === 0) { resolve('More film coming soon ~') } else { reject(err) }
    })
  })
}
exports.getTicketNameBySearch = (searchedFilmName) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM showing_movies WHERE movie_name ILIKE '%" + searchedFilmName + "%' ORDER BY movie_name ASC LIMIT 5", (err, result) => {
      if (result.rows.length !== 0) { resolve(result.rows) } else { reject(new Error('Judul film yang dicari tidak ditemukan!')) }
    })
  })
}
exports.getTicketBySortGenre = (sortByGenre) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM showing_movies WHERE movie_genre ILIKE '%" + sortByGenre + "%' ORDER BY movie_name ASC", (err, result) => {
      if (result.rows.length !== 0) { resolve(result.rows) } else { reject(new Error('Penyortiran gagal, tidak ditemukan film dengan genre tersebut!')) }
    })
  })
}

// update
exports.changeTicketData = (changeData, ticketID) => {
  const { movieName, movieGenre, ticketPrice, releaseDate, directedBy, movieDuration, movieCasts, movieSynopsis, movieImgUrl } = changeData
  return new Promise((resolve, reject) => {
    db.query("UPDATE showing_movies SET movie_name = '" + movieName + "', movie_genre = '" + movieGenre + "', ticket_price = '" + ticketPrice + "', \
    release_date = '" + releaseDate + "', directed_by = '" + directedBy + "', \ movie_duration = '" + movieDuration + "', movie_casts = '" + movieCasts + "', \
    movie_synopsis = '" + movieSynopsis + "', movie_img = '" + movieImgUrl + "', updated_at = current_timestamp WHERE ticket_id = '" + ticketID + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// delete
exports.removeTicketData = (ticketID) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM showing_movies WHERE ticket_id = '" + ticketID + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
