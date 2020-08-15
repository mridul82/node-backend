const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const passpost = require('passport');
const bodyParser = require('body-parser');
const users = require('./routes/users');

connectDB();

const app = express()

if (process.env.NODE_ENV === 'developemnt') {
    app.use(morgan('dev'))
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/users', users);

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));