// require
const express = require('express')
const route = express.Router()
const ticketDataRouter = require('./ticketData')
const transactionDataRouter = require('./transactionData')
const userDataRouter = require('./userData')
const upcomingDataRouter = require('./upcomingMovies')
const cinemaDataRouter = require('./cinemaData')

// router
route.use('/tickets', ticketDataRouter)
route.use('/transactions', transactionDataRouter)
route.use('/users', userDataRouter)
route.use('/upcomings', upcomingDataRouter)
route.use('/cinemas', cinemaDataRouter)

// exports
module.exports = route
