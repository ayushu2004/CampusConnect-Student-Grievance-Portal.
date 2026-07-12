const notFound = (req, res, _next) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const payload = {
    message: err.message || "Internal Server Error",
  };
  if (err.errors) payload.errors = err.errors;
  if (process.env.NODE_ENV !== "production") payload.stack = err.stack;
  res.status(status).json(payload);
};

module.exports = { notFound, errorHandler };
