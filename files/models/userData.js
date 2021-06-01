const db = require('../configs/db')

// create
exports.newUserData = (newData) => {
  const { userId, userEmail, userPassword } = newData
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user_data WHERE (useremail = '" + userEmail + "')", (err, res) => {
      if (res.rows.length == 0) { 
        db.query(
          "INSERT INTO user_data(userid, realname, username, useremail, userpassword, createdat, updatedat, profileimages, userjobs, userrole, usernotification, \
          isverified, phonenumber) VALUES('" + userId + "','Anonymous','anonymous','" + userEmail + "','" + userPassword + "', current_timestamp, \
          current_timestamp, 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 'New Moviegoers', 'member', 'ON', \
          false, '81391146118')", (err, result) => { 
            resolve(result.rows) }
        ) 
      } 
      else { reject(new Error("Gagal buat user baru, email sudah terdaftar!")) }
    })
  })
}

// read
exports.getUserData = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user_data", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
exports.getUserDataById = (userid) => {
  return new Promise((resolve, reject) => {
    const getUserIdQuery = "SELECT * FROM user_data WHERE userid = '" + userid + "'"
    db.query(getUserIdQuery, (err, result) => {
      result.rows.length === 0 && resolve("Tidak dapat menemukan user dengan ID yang dicari!")
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// update
exports.changeUserData = (changeData, userID) => {
  const { realName, userPassword, userJobs } = changeData
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE user_data SET realname = '" + realName + "', \
      userpassword = '" + userPassword + "', userjobs = '" + userJobs + "' \
      WHERE userid = '" + userID + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// delete
exports.removeUserData = (userID) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM user_data WHERE userid = '" + userID + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// user - login
exports.userLogin = (userEmailQuery) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user_data WHERE useremail = '" + userEmailQuery + "'", (err, result) => {
      if (result.rows.length == 0) {
        const wrongEmail = { callResult: 'Failed', statusCode: 404, errorMessage: 'Gagal login, email belum terdaftar!' }
        reject(wrongEmail)
      } else { resolve(result.rows) }
    })
  })
}

// user - upload profile picture
exports.uploadUserProfilePicture = (userid, profilePicture) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE user_data SET profileimages = '" + profilePicture + "' WHERE userid = '" + userid + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// user - verification success
exports.userVerificationSuccess = (userid) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE user_data SET isverified = true WHERE userid = '" + userid + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}

// user - reset password
exports.resetUserPassword = (userpassword, useremail) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE user_data SET userpassword = '" + userpassword + "' WHERE useremail = '" + useremail + "'", (err, result) => {
      if (!err) { resolve(result.rows) } else { reject(err) }
    })
  })
}
