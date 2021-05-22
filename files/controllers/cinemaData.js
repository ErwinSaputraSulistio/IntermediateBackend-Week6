const cinemaDataModel = require('../models/cinemaData')
const statusCode = require('./status')

// read
exports.readAllCinemaData = (req,res) => {
    cinemaDataModel.getAllCinemaData()
    .then((result) => { statusCode.statRes(res, 200, result) })
    .catch((err) => { console.log(err) })
}