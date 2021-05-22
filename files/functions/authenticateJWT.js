const jwt = require('jsonwebtoken')

// JWT - sign
// exports.signJwtToken = (req, email, name, role) => {
//    return new Promise((resolve, reject) => {
//       const payload = { userEmail: email, userRealName: name, userRole: role }
//       jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 10 } , (err, token) => {
//          if(!err) {resolve(token)}
//          else {reject(err)}
//       })
//    })
//    .then((res) => {
//       req.token = res
//       next()
//    })
//    .catch((err) => { ({ checkResult: "Failed", statusCode: 401, errorMessage: err }) })
// }

// JWT - verify
exports.verifyJwtToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token === undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: "JWT token can't be empty!" }) } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      return new Promise((resolve, reject) => {
        if (err) {
          let errMsg = ''
          if (err.name === 'JsonWebTokenError') { errMsg = 'Invalid token!' } else if (err.name === 'TokenExpiredError') { errMsg = 'JWT token already expired!' } else { errMsg = 'JWT token not active!' }
          reject(errMsg)
        } else { resolve(user) }
      })
        .then((res) => {
          req.user = res
          next()
        })
        .catch((err) => { res.status(401).json({ checkResult: 'Failed', statusCode: 401, jwtError: err }) })
    })
  }
}
