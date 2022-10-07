const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['https://localhost:7891'],
    credentials: true,
  })
);

// App routes
app.use('/api/v1/auth', require('./controllers/auth'));
app.use('/api/v1/items', require('./controllers/items'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
