const db = require('../configs/db')

// create
exports.newUpcomingData = (newData) => {
  const {upcomingId, upcomingName, upcomingGenre, upcomingSynopsis, releaseDate, movieDuration, directedBy, movieCasts, upcomingImgUrl} = newData
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO upcoming_movies(upcoming_id, upcoming_name, upcoming_genre, created_at, updated_at, \
      release_date, directed_by, movie_duration, movie_casts, upcoming_synopsis, upcoming_img) VALUES('" + upcomingId + "', \
      '" + upcomingName + "','" + upcomingGenre + "',current_timestamp,current_timestamp,'" + releaseDate + "', \
      '" + directedBy + "','" + movieDuration + "','" + movieCasts + "','" + upcomingSynopsis + "','" + upcomingImgUrl + "')", (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// read
exports.getAllUpcomingData = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM upcoming_movies ORDER BY upcoming_name ASC', (err, result) => {
      result.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
exports.getUpcomingDataById = (upcoming_id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM upcoming_movies WHERE upcoming_id = '" + upcoming_id + "'", (err, result) => {
      result.length === 0 && resolve('Tidak dapat menemukan film dengan ID yang dicari!')
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
exports.getUpcomingDataPerPage = (queryPages, queryLimits) => {
  const calcPaginationLogics = queryPages * queryLimits - queryLimits
  let inputLimitOrNot = ''
  let inputOffsetOrNot = ''
  queryPages !== 0 ? (inputLimitOrNot += 'LIMIT ' + queryLimits + ' ') && (inputOffsetOrNot += 'OFFSET ' + calcPaginationLogics) : null
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM upcoming_movies ORDER BY updated_at DESC ' + inputLimitOrNot + inputOffsetOrNot + ';', (err, result) => {
      if (!err && result.length !== 0) { resolve(result.rows) } else if (result.length === 0) { resolve('More film coming soon ~') } else { reject(err) }
    })
  })
}
exports.getUpcomingNameBySearch = (searchedFilmName) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM upcoming_movies WHERE upcoming_name like '%" + searchedFilmName + "%' ORDER BY updated_at DESC", (err, result) => {
      if (result.length !== 0) { resolve(result.rows) } else { reject(new Error('Judul film yang dicari tidak ditemukan!')) }
    })
  })
}
exports.getUpcomingBySortGenre = (sortByGenre) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM upcoming_movies WHERE upcoming_genre like '%" + sortByGenre + "%' ORDER BY upcoming_name ASC", (err, result) => {
      if (result.length !== 0) { resolve(result.rows) } else { reject(new Error('Penyortiran gagal, tidak ditemukan film dengan genre tersebut!')) }
    })
  })
}

// update
exports.changeUpcomingData = (changeData, ticketID) => {
  const { upcomingName, upcomingGenre, upcomingSynopsis, releaseDate, movieDuration, directedBy, movieCasts, upcomingImgUrl } = changeData
  return new Promise((resolve, reject) => {
    db.query("UPDATE upcoming_movies SET upcoming_name = '" + upcomingName + "', upcoming_genre = '" + upcomingGenre + "', \
    release_date = '" + releaseDate + "', directed_by = '" + directedBy + "', \ movie_duration = '" + movieDuration + "', movie_casts = '" + movieCasts + "', \
    upcoming_synopsis = '" + upcomingSynopsis + "', upcoming_img = '" + upcomingImgUrl + "', updated_at = current_timestamp WHERE upcoming_id = '" + ticketID + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// delete
exports.removeUpcomingData = (ticketID) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM upcoming_movies WHERE upcoming_id = '" + ticketID + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
