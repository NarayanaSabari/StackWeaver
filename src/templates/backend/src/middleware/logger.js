// logger.js

const logger = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ${method} ${url}`;

  // Also log to console
  console.log(log);

  next();
};

module.exports = {logger}
