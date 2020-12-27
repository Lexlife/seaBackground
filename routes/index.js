const express = require('express');

const router = express.Router();

const authCheck = (req, res, next) => { // мидлвер который редиректит юзера на форму логина если в сессии нет username (username в сессию мы записываем если он ввел логин и пароль)
  if (req.session.username) {
    next();
  } else {
    res.redirect('/users/signin');
  }
};

/* GET home page. */
router.get('/', (req, res, next) => {
  router.get('/', (req, res, next) => {
    // обращается к сайту каждые 29 минут
  const https = require("https");
  setTimeout(() => {
    https.get("https://seaback.herokuapp.com");
  }, 1000*60*29); // every 29 minutes
    res.render('index', { title: 'Giphy' });
  });
  res.render('index', { title: 'Волки: 2020-2021', greet: 'Эльбрус' });
});

router.get('/shoppingcart', authCheck, (req, res) => {
  // search in db
  const items = [{ name: 'Banana' }, { name: 'Orange' }];
  res.render('cart', { items });
});

module.exports = router;
