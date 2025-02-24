'use strict';
//use nodemon to start app.js in package.json
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const connect = require('./server/models/connect');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

// use middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);


app.use(cookieParser('PhotographySiteSecure'));
app.use(session({
  secret: 'PhotographySiteSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/photoRoutes.js');
app.use('/', routes);
const cors = require('cors');
app.use(cors());

(async function () {
  await connect();

  app.listen(port, () => console.log(`Listening to port ${port}`));
})();
