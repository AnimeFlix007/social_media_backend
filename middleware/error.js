const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "internal server error"
  err.statusCode = err.statusCode || 500
  res.status(err.statusCode).json({
      message: err.message
  })
};

module.exports = errorMiddleware;