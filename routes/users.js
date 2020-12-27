require('dotenv').config(); // парсит из .env фала все переменные в объект process.env
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
const sha256 = require('sha256');

const User = mongoose.model('User', { name: String, password: String });

router.get('/search', (req, res) => {
  res.render('search');
});

router.post('/search', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ name: username });
  // console.log(req.cookies.searchCount);
  let myCounter = Number(req.cookies.searchCount); // достаем из куков searchCount и преобразуем в число
  if (myCounter) {
    myCounter += 1;
    res.cookie('searchCount', myCounter); // отправляем на клиент куки searchCount=значение (старые куки с таким именем обновляются)
  } else {
    myCounter = 1;
    res.cookie('searchCount', myCounter, { 'Max-Age': 86400000 }); // отправляем на клиент куки searchCount=значение со сроком жизни сутки
  }
  res.render('profile', { user });
});

router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  // находить юзера по req.params и возвращать его
  const user = await User.findById(id);
  res.render('profile', { user });
});

router.route('/signup')
  .get((req, res) => {
    //
    res.render('signup');
  })

  .post(async (req, res) => {
    // получаем данные из формы
    const { name, password } = req.body;
    const securePass = sha256(password); // зашифровали пароль, который пришел от юзера
    const user = new User({ name, password: securePass });
    await user.save();
    req.session.username = name; // добавляет в сессию имя юзера
    // res.status(200).end();
    res.render('profile', { user });
  });

router.route('/signin')
  .get((req, res) => {
    res.render('signin');
  })

  .post(async (req, res) => {
    console.log(req.session);
    if ((new Date().getTime() - Number(req.session?.time)) < 30000) { // проверяем задержку между попытками ввода пароля
      return res.send('уходи');
    }
    req.session.time = new Date().getTime(); // добавляем в сессию время ввода пароля
    // получаем данные из формы
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (user) {
      if (sha256(password) === user.password) { // сравниваем пароль из базы (шифрованный) с зашифрованным паролем, который ввел юзер
        req.session.username = name; // добавляет в сессию имя юзера
      } else {
        return res.send('incorrect pass');
      }
    } else {
      return res.send('unknown user');
    }
    // res.status(200).end();
    res.render('profile', { user });
  });

router.delete('/:test', async (req, res) => {
  try {
    // находим и удаляем
    const user = await User.findOneAndDelete({ name: req.params.test });
    console.log(user);
    return res.status(200).end();
  } catch (e) {
    return res.status(500).end();
  }
});

router.get('/logout', (req, res) => {
  // res.cookie('connect.sid', 0, { Expires: 'Thu Dec 10 1970 11:47:06 GMT+0300 (Москва, стандартное время)' });
  req.session.destroy(); // удаляем сессию
  res.redirect('/');
});

module.exports = router;
