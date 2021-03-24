exports.checkAdmin = (req, res, next) => {
   if(req.user.userRole !== "admin") { res.json({callResult: "Forbidden", statusCode: 403, errorMessage: "Access denied, admin only!"}) }
   else { next() }
}