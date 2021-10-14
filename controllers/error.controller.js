module.exports = (err, req, res, next) => {
  if (err.statusCode === 500) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: 'Internal server error',
    })
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}