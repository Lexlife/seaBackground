require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // парсер куков в объект (куки на клиенте это строка)
app.use(session({ // этот мидлвер создает сессии
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // secure=https
  store: new MongoStore({ mongooseConnection: mongoose.createConnection(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }) }),
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // console.log(req.cookies);
  res.locals.searchCount = req.cookies?.searchCount; // optional chaining operator (google it!)
  if (req.cookies?.searchCount >= 5) {
    res.locals.restricted = true;
  } else {
    res.locals.restricted = false;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.username = req.session?.username; // если в сессии есть юзернейм записываем его в локальную переменную
  // console.log(req.session);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
 */
app.listen(process.env.PORT);
