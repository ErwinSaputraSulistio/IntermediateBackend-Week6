// require
const express = require('express')
const router = express.Router()
const userDataController = require('../controllers/userData')
const jwtCheck = require('../functions/authenticateJWT')
const {uploadAvatar} = require('../functions/multer') 

// router
router
  .post('/', userDataController.createUserData)
  .get('/', userDataController.readUserData)
  .get('/:id', userDataController.readUserDataById)
  .put('/:id', jwtCheck.verifyJwtToken, userDataController.updateUserData)
  .patch('/:id', jwtCheck.verifyJwtToken, uploadAvatar.single('profileImages'), userDataController.changeUserAvatar)
  .delete('/:id', jwtCheck.verifyJwtToken, userDataController.deleteUserData)
  .post('/login', userDataController.postUserLogin)
  .get('/verify/:id', userDataController.verifyNewUser)

// exports
module.exports = router
