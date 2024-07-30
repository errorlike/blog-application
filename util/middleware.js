const jwt = require('jsonwebtoken');
const { SECRET } = require('./config.js');
const Session = require('../models/session.js');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      if (!await Session.findOne({ where: { userId: req.decodedToken.id } })) {
        return res.status(401).json({ error: 'token invalid' });
      }
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};


const errorHandler = (error, request, response, next) => {
  // console.error(error.message);
  // console.error(error.name);
  console.error(error);
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message });
  }
  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};
module.exports = { tokenExtractor, errorHandler };