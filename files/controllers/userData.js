const userDataModel = require('../models/userData')
const NM = require('../functions/nodemailer')
const statusCode = require('./status')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')

// hash password - set up bcrypt
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

// create
exports.createUserData = (req, res) => {
  try {
    const { userEmail, userPassword } = req.body
    const userId = uuidv4()
    const hashedUserPassword = bcrypt.hashSync(userPassword, salt)
    const newData = {
      userId,
      userEmail,
      userPassword: hashedUserPassword
    }
    userDataModel.newUserData(newData)
      .then(() => {
        const payload = { userId }
        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 15 }, (err, token) => {
          statusCode.loginWithJWT(res, 200, userId, token)
          NM.sendEmail(token, userEmail)
        })
      })
      .catch((err) => { res.status(404).json({ callResult: err.message, statusCode: 404 }) })
  } catch (err) { res.send('ERROR : ' + err.message) }
}

// read
exports.readUserData = (req, res) => {
  userDataModel.getUserData()
    .then((result) => { statusCode.statRes(res, 200, result) })
    .catch((err) => { console.log(err) })
}
exports.readUserDataById = (req, res) => {
  const userId = req.params.id
  userDataModel.getUserDataById(userId)
    .then((result) => { statusCode.statRes(res, 200, result) })
    .catch((err) => { console.log(err) })
}

// update
exports.updateUserData = (req, res) => {
  try {
    const userId = req.params.id
    const { realName, userPassword, userJobs } = req.body
    const hashedUserPassword = bcrypt.hashSync(userPassword, salt)
    const changeData = {
      realName,
      userPassword: hashedUserPassword,
      userJobs
    }
    userDataModel.changeUserData(changeData, userId)
      .then(() => { statusCode.statRes(res, 201, 'Berhasil ubah data User!') })
      .catch((err) => { console.log(err) })
  } catch (err) { res.send('ERROR : ' + err.message) }
}

// delete
exports.deleteUserData = (req, res) => {
  const userId = req.params.id
  userDataModel.removeUserData(userId)
    .then(() => { statusCode.statRes(res, 200, 'Berhasil hapus data User!') })
    .catch((err) => { console.log(err) })
}

// user - login
exports.postUserLogin = (req, res) => {
  const { loginEmail, loginPassword } = req.body
  userDataModel.userLogin(loginEmail)
    .then((result) => {
      const getUserData = result[0]
      const checkPassword = bcrypt.compareSync(loginPassword, getUserData.userpassword)
      if (checkPassword === false) { res.status(404).json({ callResult: 'Failed', statusCode: 404, errorMessage: 'Gagal login, password salah!' }) } else {
        if (getUserData.isverified === false) { res.status(403).json({ useremail: getUserData.useremail, isverified: false, callResult: 'Failed', statusCode: 403, errorMessage: 'User belum di verifikasi!' }) } else {
          const payload = { useremail: getUserData.useremail, realname: getUserData.realname, userrole: getUserData.userrole }
          jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            statusCode.loginWithJWT(res, 200, result, token)
          })
        }
      }
    })
    .catch((err) => { res.json(err) })
}

// user - upload profile picture
exports.changeUserAvatar = (req, res) => {
  try {
    const userId = req.params.id
    const profilePictureURL = 'http://localhost:2000/img/avatar/' + req.file.filename
    userDataModel.uploadUserProfilePicture(userId, profilePictureURL)
      .then(() => { statusCode.statRes(res, 201, 'Berhasil mengganti gambar profil user!') })
      .catch((err) => { res.send(err.message) })
  } catch (err) { res.status(400).json({ callResult: 'Failed', statusCode: 400, errorMessage: 'Gagal mengubah avatar user!' }) }
}

// user - verification
exports.verifyNewUser = (req, res) => {
  const checkJwtToken = req.params.id
  try {
    if (checkJwtToken === null || checkJwtToken == undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: 'Invalid JWT token!' }) } else {
      jwt.verify(checkJwtToken, process.env.JWT_SECRET_KEY, (err, user) => {
        cancelCreateUser = (error) => {
          userDataModel.removeUserData("userId")
            .then(() => { res.status(401).json({ checkResult: 'Failed', statusCode: 401, jwtError: error }) })
            .catch((err) => { console.log(err) })
        }
        if (err) {
          console.log(err)
          let errMsg = ''
          if (err.name === 'JsonWebTokenError') { errMsg = 'Invalid JWT token, canceling account creation!' } else if (err.name === 'TokenExpiredError') { errMsg = 'JWT token already expired, canceling account creation!' } else { errMsg = 'JWT token not active, canceling account creation!' }
          cancelCreateUser(errMsg)
        } else {
          userDataModel.userVerificationSuccess(user.userId)
            .then(() => { res.send('Verifikasi user berhasil, silahkan login!') })
            .catch((err) => { res.send(err.message) })
        }
      })
    }
  } catch (err) { res.send('ERROR : ' + err.message) }
}
