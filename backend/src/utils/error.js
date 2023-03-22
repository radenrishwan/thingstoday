export function errorHandler (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.json({ 
        code: 500,
        message: "Internal Server Error",
        data: null
     })
  }