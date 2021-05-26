const ticketDataModel = require('../models/ticketData')
const { v4: uuidv4 } = require('uuid')
const statusCode = require('./status')
// const redis = require('redis')
// const client = redis.createClient(16379)

// create
exports.createTicketData = (req, res) => {
  const movieImgUrl = 'https://ciwin-react-tickitz-arkademy.netlify.app/img/movie/' + req.file.filename
  const {
    movieName,
    movieGenre,
    ticketPrice,
    releaseDate,
    directedBy,
    movieDuration,
    movieCasts,
    movieSynopsis
  } = req.body
  const newData = {
    ticketId: uuidv4(),
    movieName,
    movieGenre,
    ticketPrice,
    releaseDate,
    directedBy,
    movieDuration,
    movieCasts,
    movieSynopsis,
    movieImgUrl
  }
  ticketDataModel.newTicketData(newData)
    .then(() => { statusCode.statRes(res, 201, 'Berhasil memasukkan film baru!') })
    .catch((err) => { console.log(err) })
}

// read
exports.readAllTicketData = (req, res) => {
  ticketDataModel.getAllTicketData()
    .then((result) => {
      // client.setex('redisMovieTicketData', 60 * 1, JSON.stringify(result))
      return statusCode.statRes(res, 200, result)
    })
    .catch((err) => { console.log(err) })
}
exports.readTicketDataById = (req, res) => {
  const ticketId = req.params.id
  ticketDataModel.getTicketDataById(ticketId)
    .then((result) => {
      // client.setex('redisMovieTicketData' + result[0].ticketId, 60 * 1, JSON.stringify(result))
      return statusCode.statRes(res, 200, result)
    })
    .catch((err) => { console.log(err) })
}
exports.readTicketDataPerPage = (req, res) => {
  const checkQuery = req.query
  const queryKeys = Object.keys(checkQuery)
  if (queryKeys.includes('page') === true && queryKeys.includes('limit') === true) {
    const queryPages = parseInt(checkQuery.page)
    const queryLimits = parseInt(checkQuery.limit)
    if (Number.isNaN(queryPages) === false && Number.isNaN(queryLimits) === false) {
      ticketDataModel.getTicketDataPerPage(queryPages, queryLimits)
        .then((result) => {
          res.json({
            outputData: result,
            previousPage: 'localhost:2000/v1/tickets?page=' + String(queryPages - 1) + '&limit=' + String(queryLimits),
            nextPage: 'localhost:2000/v1/tickets?page=' + String(queryPages + 1) + '&limit=' + String(queryLimits)
          })
        })
        .catch((err) => { console.log(err) })
    } else { statusCode.queryNaN(res) }
  } else if (queryKeys.includes('movie-name') === true) {
    const ticketNameQuery = Object.values(req.query)
    ticketDataModel.getTicketNameBySearch(ticketNameQuery)
      .then((result) => { res.json({ callResult: 'Success', statusCode: 200, outputData: result, errorHandling: null }) })
      .catch(() => { statusCode.notFoundFilm(res) })
  } else if (queryKeys.includes('genre') === true) {
    const ticketNameQuery = Object.values(req.query)
    ticketDataModel.getTicketBySortGenre(ticketNameQuery)
      .then((result) => { res.json({ callResult: 'Success', statusCode: 200, sortedByGenre: req.query.genre, outputData: result, errorHandling: null }) })
      .catch(() => { statusCode.sortGenreFailed(res) })
  } else { statusCode.invalidQuery(res) }
}

// update
exports.updateTicketData = (req, res) => {
  const ticketId = req.params.id
  const movieImgUrl = 'https://ciwin-react-tickitz-arkademy.netlify.app/img/movie/' + req.file.filename
  const {
    movieName,
    movieGenre,
    ticketPrice,
    releaseDate,
    directedBy,
    movieDuration,
    movieCasts,
    movieSynopsis
  } = req.body
  const changeData = {
    movieName,
    movieGenre,
    ticketPrice,
    releaseDate,
    directedBy,
    movieDuration,
    movieCasts,
    movieSynopsis,
    movieImgUrl
  }
  ticketDataModel.changeTicketData(changeData, ticketId)
    .then(() => { statusCode.statRes(res, 201, 'Berhasil ubah data film!') })
    .catch((err) => { console.log(err) })
}

// delete
exports.deleteTicketData = (req, res) => {
  const ticketId = req.params.id
  ticketDataModel.removeTicketData(ticketId)
    .then(() => { statusCode.statRes(res, 200, 'Berhasil hapus data film!') })
    .catch((err) => { console.log(err) })
}
