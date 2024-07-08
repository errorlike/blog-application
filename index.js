const express = require('express');
const app = express();
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
require('express-async-errors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const errorHandler = (error, request, response, next) => {
  // console.error(error.message);
  // console.error(error.name);
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message });
  }
  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};

app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
