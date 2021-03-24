exports.statRes = (res, status, result) => {
  const output = {}
  output.callResult = 'Success'
  output.statusCode = status
  output.outputData = result
  res.status(status).json(output)
}

exports.invalidQuery = (res) => { res.status(400).json({ callResult: 'Failed', statusCode: 400, errorDetail: 'Invalid query' }) }
exports.queryNaN = (res) => { res.status(400).json({ callResult: 'Faild', statusCode: 400, errorDetail: 'Query input is not a number' }) }
exports.notFoundFilm = (res) => { res.status(404).json({ callResult: 'Failed', statusCode: 404, errorDetail: 'Judul film yang dicari tidak ditemukan!' }) }
exports.sortGenreFailed = (res) => { res.status(404).json({ callResult: 'Failed', statusCode: 404, errorDetail: 'Sort gagal, tidak ditemukan film dengan genre yang sesuai!' }) }

exports.loginWithJWT = (res, status, result, key) => {
  const output = {}
  output.callResult = 'Success'
  output.statusCode = status
  output.outputData = result
  output.jwtSecretKey = key
  res.status(status).json(output)
}
