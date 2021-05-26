const db = require('../configs/db')

// read
exports.getAllCinemaData = () => {
   return new Promise((resolve,reject) => {
      db.query('SELECT * FROM cinema_list ORDER BY cinema_id ASC', (err,result) => {
         if (!err) { resolve(result.rows) } else { reject(err) }
      })
   })
}