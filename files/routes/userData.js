// require
const express = require('express')
const router = express.Router()
const userDataController = require('../controllers/userData')
const jwtCheck = require('../functions/authenticateJWT')
const { uploadAvatar, uploadMovieImg } = require('../functions/multer')

// router
router
  .post('/', userDataController.createUserData)
  .get('/', userDataController.readUserData)
  .get('/:id', userDataController.readUserDataById)
  .put('/:id', jwtCheck.verifyJwtToken, userDataController.updateUserData)
  .patch('/:id', jwtCheck.verifyJwtToken, uploadAvatar, userDataController.changeUserAvatar)
  .delete('/:id', jwtCheck.verifyJwtToken, userDataController.deleteUserData)
  .post('/login', userDataController.postUserLogin)
  .get('/verify/:id', userDataController.verifyNewUser)
  .post('/reset/send-mail', userDataController.sendResetPasswordMail)
  .put('/reset/new-password', userDataController.resetPassword)
  .get('/reset/:id', userDataController.checkIfJwtResetValid)

// exports
module.exports = router
