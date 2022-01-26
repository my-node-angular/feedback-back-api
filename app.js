const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParsr = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, (err) => {
  if (!err) {
    console.log('DB Connected');
  } else {
    console.log('DB Failed to Connected');
  }
});
mongoose.Promise = global.Promise;

const userRoutes = require('./api/routes/user');
const floorRoutes = require('./api/routes/floor');
const departmentRoutes = require('./api/routes/department');
const roomRoutes = require('./api/routes/room');
const messageRoutes = require('./api/routes/message');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParsr.urlencoded({ extended: false }));
app.use(bodyParsr.json());

//header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-type, Authorization');
  if (req.method === '  OPTIONS') {
    res.header('Access-Control-Allow-Methods', '*');
    return res.status(200).json({});
  }
  next();
});

//Route
app.use('/user', userRoutes);
app.use('/floors', floorRoutes);
app.use('/departments', departmentRoutes);
app.use('/rooms', roomRoutes);
app.use('/msg', messageRoutes);

//Handle Error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
