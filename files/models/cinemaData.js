const db = require('../configs/db')

// read
exports.getAllCinemaData = () => {
   return new Promise((resolve,reject) => {
      db.query('SELECT * FROM cinema_list ORDER BY cinemaId ASC', (err,result) => {
         if (!err) { resolve(result) } else { reject(err) }
      })
   })
}