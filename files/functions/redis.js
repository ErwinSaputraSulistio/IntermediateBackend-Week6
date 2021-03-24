const redis = require('redis')
const client = redis.createClient(16379)

exports.takeAllRedisMovieTicketData = (req, res, next)=>{
   client.get('redisMovieTicketData', (err, data)=>{
      if(data !== null){
         console.log("REDIS :", "\x1b[32mFound all movies ticket data, read all of them from Redis instead from DB, saving memory and increasing DB capacity ...\x1b[0m")
         const result = JSON.parse(data)
         return res.json( { callResult: "Success", statusCode: 200, outputData: result } )
      } 
      else {
         console.log("REDIS :", "\x1b[33mAll movies ticket data not found, re-create a new one (this may takes a bit longer!)\x1b[0m")
         next() 
      }
   })
}

exports.takeRedisMovieTicketDataByID = (req, res, next)=>{
   client.get('redisMovieTicketData' + req.params.id, (err, data)=>{
      if(data !== null){
         console.log("REDIS :", "\x1b[32mFound a movie ticket data with ID - '" 
         + req.params.id + "', \nread this movie ticket data with ID of '"+ req.params.id 
         + "' from Redis instead from DB, saving memory and increasing DB capacity ...\x1b[0m")
         const result = JSON.parse(data)
         return res.json( { callResult: "Success", statusCode: 200, outputData: result } )
      } 
      else {
         console.log("REDIS :", "\x1b[33mMovie ticket data with ID of '" + req.params.id + "' was not found, re-create a new one (this may takes a bit longer!)\x1b[0m")
         next() 
      }
   })
}

exports.takeAllRedisUpcomingMovieData = (req, res, next)=>{
   client.get('redisUpcomingMovieData', (err, data)=>{
      if(data !== null){
         console.log("REDIS :", "\x1b[32mFound all upcoming movies data, read all of them from Redis instead from DB, saving memory and increasing DB capacity ...\x1b[0m")
         const result = JSON.parse(data)
         return res.json( { callResult: "Success", statusCode: 200, outputData: result } )
      } 
      else {
         console.log("REDIS :", "\x1b[33mAll upcoming movies data not found, re-create a new one (this may takes a bit longer!)\x1b[0m")
         next() 
      }
   })
}

exports.takeRedisUpcomingMovieDataByID = (req, res, next)=>{
   client.get('redisUpcomingMovieData' + req.params.id, (err, data)=>{
      if(data !== null){
         console.log("REDIS :", "\x1b[32mFound an upcoming movie data with ID - '" 
         + req.params.id + "', \nread this upcoming movie data with ID of '"+ req.params.id 
         + "' from Redis instead from DB, saving memory and increasing DB capacity ...\x1b[0m")
         const result = JSON.parse(data)
         return res.json( { callResult: "Success", statusCode: 200, outputData: result } )
      } 
      else {
         console.log("REDIS :", "\x1b[33mUpcoming movie data with ID of '" + req.params.id + "' was not found, re-create a new one (this may takes a bit longer!)\x1b[0m")
         next() 
      }
   })
}

exports.removeRedisMovieTicketDataByID = (req, res, next) => {
   console.log("\x1B[31mDelete a movie ticket data with ID of '" + req.params.id + "' from Redis was success!")
   client.del("redisMovieTicketData" + req.params.id)
   next()
}

exports.removeRedisUpcomingMovieDataByID = (req, res, next) => {
   console.log("\x1B[31mDelete an upcoming movie data with ID of '" + req.params.id + "' from Redis was success!")
   client.del("redisUpcomingMovieData" + req.params.id)
   next()
}