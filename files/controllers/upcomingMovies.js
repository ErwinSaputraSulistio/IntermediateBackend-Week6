const upcomingDataModel = require('../models/upcomingMovies')
const { v4: uuidv4 } = require('uuid')
const statusCode = require('./status')
const redis = require('redis')
const client = redis.createClient(16379)

// create
exports.createUpcomingData = (req, res) => {
  const upcomingImgUrl = 'http://localhost:2000/img/movie/' + req.file.filename
  const { upcomingName, upcomingGenre, upcomingSynopsis, releaseDate, movieDuration, directedBy, movieCasts } = req.body
  const newData = {
    upcomingId: uuidv4(),
    upcomingName,
    upcomingGenre,
    upcomingSynopsis,
    releaseDate,
    movieDuration,
    directedBy,
    movieCasts,
    upcomingImgUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  upcomingDataModel.newUpcomingData(newData)
    .then(() => { statusCode.statRes(res, 201, 'Berhasil memasukkan film baru!') })
    .catch((err) => { console.log(err) })
}

// read
exports.readAllUpcomingData = (req, res) => {
  upcomingDataModel.getAllUpcomingData()
    .then((result) => { 
      client.setex("redisUpcomingMovieData", 60 * 1, JSON.stringify(result))
      return statusCode.statRes(res, 200, result)
    })
    .catch((err) => { console.log(err) })
}
exports.readUpcomingDataById = (req, res) => {
  const upcomingId = req.params.id
  upcomingDataModel.getUpcomingDataById(upcomingId)
    .then((result) => { 
      client.setex("redisUpcomingMovieData" + result[0].upcomingId, 60 * 1, JSON.stringify(result))
      return statusCode.statRes(res, 200, result) 
    })
    .catch((err) => { console.log(err) })
}
exports.readUpcomingDataPerPage = (req, res) => {
  const checkQuery = req.query
  const queryKeys = Object.keys(checkQuery)
  if (queryKeys.includes('page') === true && queryKeys.includes('limit') === true) {
    const queryPages = parseInt(checkQuery.page)
    const queryLimits = parseInt(checkQuery.limit)
    if (Number.isNaN(queryPages) === false && Number.isNaN(queryLimits) === false) {
      upcomingDataModel.getUpcomingDataPerPage(queryPages, queryLimits)
        .then((result) => {
          res.json({
            outputData: result,
            previousPage: 'localhost:2000/v1/upcomings?page=' + String(queryPages - 1) + '&limit=' + String(queryLimits),
            nextPage: 'localhost:2000/v1/upcomings?page=' + String(queryPages + 1) + '&limit=' + String(queryLimits)
          })
        })
        .catch((err) => { console.log(err) })
    } else { statusCode.queryNaN(res) }
  } else if (queryKeys.includes('upcoming-name') === true) {
    const upcomingNameQuery = Object.values(req.query)
    upcomingDataModel.getUpcomingNameBySearch(upcomingNameQuery)
      .then((result) => { res.json({ callResult: 'Success', statusCode: 200, outputData: result, errorHandling: null }) })
      .catch(() => { statusCode.notFoundFilm(res) })
  } else if (queryKeys.includes('upcoming-genre') === true) {
    const upcomingNameQuery = Object.values(req.query)
    upcomingDataModel.getUpcomingBySortGenre(upcomingNameQuery)
      .then((result) => { res.json({ callResult: 'Success', statusCode: 200, sortedByGenre: req.query.genre, outputData: result, errorHandling: null }) })
      .catch(() => { statusCode.sortGenreFailed(res) })
  } else { statusCode.invalidQuery(res) }
}

// update
exports.updateUpcomingData = (req, res) => {
  const upcomingId = req.params.id
  const upcomingImgUrl = 'http://localhost:2000/img/movie/' + req.file.filename
  const { upcomingName, upcomingGenre, upcomingSynopsis, releaseDate, movieDuration, directedBy, movieCasts } = req.body
  const changeData = {
    upcomingName,
    upcomingGenre,
    upcomingSynopsis,
    releaseDate,
    movieDuration,
    directedBy,
    movieCasts,
    upcomingImgUrl,
    updatedAt: new Date()
  }
  upcomingDataModel.changeUpcomingData(changeData, upcomingId)
    .then(() => { statusCode.statRes(res, 201, 'Berhasil ubah data film!') })
    .catch((err) => { console.log(err) })
}

// delete
exports.deleteUpcomingData = (req, res) => {
  const upcomingId = req.params.id
  upcomingDataModel.removeUpcomingData(upcomingId)
    .then(() => { statusCode.statRes(res, 200, 'Berhasil hapus data film!') })
    .catch((err) => { console.log(err) })
}
