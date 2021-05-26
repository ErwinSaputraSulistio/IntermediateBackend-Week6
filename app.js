// first set-ups (require)
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 3000
const route = require('./files/routes')

// app - settings
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({origin: 'https://ciwin-react-tickitz-arkademy.netlify.app', credentials: true}))
app.use(morgan('dev'))
app.listen(port, '0.0.0.0', () => { console.log('Server telah di-aktivasi dengan port ' + port) })

// routers
app.use('/v1', route)
app.use('/img/avatar', express.static('./uploads/images/avatars'))
app.use('/img/movie', express.static('./uploads/images/movies'))
