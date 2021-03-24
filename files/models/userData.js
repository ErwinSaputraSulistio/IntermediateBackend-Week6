const db = require('../configs/db')

// create
exports.newUserData = (userEmail, newData) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user_data WHERE (userEmail = '" + userEmail + "')", (err, res) => {
      if (res.length == 0) {db.query('INSERT INTO user_data SET ?', newData, (err, result) => {resolve(result)})} 
      else {reject(new Error('Gagal buat user baru, email sudah terdaftar!'))}
    })
  })
}

// read
exports.getUserData = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM user_data', (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}
exports.getUserDataById = (userId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM user_data WHERE userId = ?', userId, (err, result) => {
      result.length === 0 && resolve('Tidak dapat menemukan user dengan ID yang dicari!')
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// update
exports.changeUserData = (changeData, userID) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE user_data SET ? WHERE userId = ?', [changeData, userID], (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// delete
exports.removeUserData = (userID) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM user_data WHERE userId = ?', userID, (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// user - login
exports.userLogin = (userEmailQuery) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user_data WHERE (userEmail = '" + userEmailQuery + "' OR userName = '" + userEmailQuery + "')", (err, result) => {
      if (result.length == 0) { 
        const wrongEmail = {callResult: 'Failed', statusCode: 404, errorMessage: 'Gagal login, email belum terdaftar!'}
        reject(wrongEmail) 
      } 
      else { resolve(result) }
    })
  })
}

// user - upload profile picture
exports.uploadUserProfilePicture = (userId, profilePicture) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE user_data SET profileImages = '" + profilePicture + "' WHERE userId = '" + userId + "'", (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}

// user - verification success
exports.userVerificationSuccess = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE user_data SET isVerified = 1 WHERE userId = '" + userId + "'", (err, result) => {
      if (!err) { resolve(result) } else { reject(err) }
    })
  })
}