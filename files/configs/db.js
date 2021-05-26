const { Pool } = require('pg')
const connectionString = 'postgres://zqdhixnlpwvobo:a83da7b61dba09d847e0eed9580a711ed84ae2d1f51e7498a52f945a6c8614a9@ec2-3-215-57-87.compute-1.amazonaws.com:5432/d60epjo528c0fe'

const db = new Pool({
  connectionString,
  ssl: {
     rejectUnauthorized: false
  }
})

module.exports = db
