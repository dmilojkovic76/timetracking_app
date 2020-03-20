const express = require('express'); // glavna biblioteka za server
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // create, sign, and verify jwt tokens
const config = require('../../config'); // konfiguracijski fajl sa parametrima za server

// Za pravu primenu ovo bi trebalo da bude nesto kao Redis a ne obican array
const tokenList = {}

const router = express.Router();

const User = require('../models/users');

function respond422Err(res) {
  res.status(422).json({ success: false, message: 'Neuspešno prijavljivanje!' });
}

router.use(bodyParser.json()); // only parses json data
router.use(bodyParser.urlencoded({ // handles the urlencoded bodies
  extended: true,
}));

// Autorizacija korisnika (POST http://localhost:3000/api/users/sign-in)
router.post('/sign-in', (req, res) => {
  // prvo pronadji korisnika pomocu User modela
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      respond422Err(res);
    } else if (user) {
      // proveri da li se sifre podudaraju
      bcrypt.compare(req.body.password, user.password)
        .then((result) => {
          if (result === false) {
            respond422Err();
          } else { // ako imamo korisnika i lozinke se podudaraju kreiraj token i autorizuj
            const payload = { // kreiram payload samo sa imenom i emailom
              _id: user._id, // eslint-disable-line
              fullName: user.fullName,
              email: user.email,
            };

            const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLife });
            // eslint-disable-next-line max-len
            const refreshToken = jwt.sign(payload, config.refreshSecret, { expiresIn: config.refreshTokenLife });

            const response = {
              success: true,
              token,
              refreshToken,
              user: {
                fullName: user.fullName,
                email: user.email,
                id: user._id, // eslint-disable-line
              },
            };

            tokenList[refreshToken] = response;

            res.status(200).json(response);
          }
        });
    }
  });
});

// Dodavanje korisnika (POST http://localhost:3000/api/users/sign-up)
router.post('/sign-up', (req, res) => {
  User.findOne({ email: req.body.email }, (err, pronadjen) => {
    if (err) throw err;
    if (!pronadjen) {
      // prvo kreiraj hash za sifru i postavi je na potencijalnog korisnika
      bcrypt.hash(req.body.password, 12)
        .then((hashedPassword) => {
          // umetni criptovanu sufru u user-a
          const newUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
          };
          const user = new User(newUser); // kreiraj kopiju korisnika po prethodnom modelu, pa
          // ga podesi podacima iz request body-ja u kome su prosledjeni
          user.save((_err) => { // snimi korisnika i proveri da li ima gresaka
            if (_err) res.status(400).send(_err);
          });
          res.status(201).json({
            success: true,
            message: 'Korisnik kreiran!',
            user: {
              fullName: user.fullName,
              email: user.email,
              id: user._id, // eslint-disable-line
            },
          });
        });
    } else { // korisnik vec postoji
      respond422Err();
    }
  });
});

// Sve rute posle ovoga moraju da posalju token
router.use(require('../tokenChecker'));

// Izlistavanje svih korisnika (GET http://localhost:3000/api/users)
router.get('/', (req, res) => {
  // prvo proveri da li je poslat token pa i da li ga imamo u listi aktivnih
  if ((req.body.refreshToken) && (req.body.refreshToken in tokenList)) {
    try {
      User.find((err, users) => {
        if (err) {
          res.status(400).send(err);
        } else {
          // kreiram payload samo sa imenom i emailom
          const payload = {
            _id: req.body.user._id, // eslint-disable-line
            fullName: req.body.user.fullName,
            email: req.body.user.email,
          };
          // generisem novi token
          const newToken = jwt.sign(payload, config.secret, { expiresIn: config.tokenLife });
          // prosledjujem novi token i trazene usere nazad
          const response = {
            token: newToken,
            users,
          };
          // osvezimo token u nasoj listi aktivnih tokena
          tokenList[req.body.refreshToken].token = newToken;
          res.status(200).json(response);
        }
      });
    } catch (error) {
      res.json({
        error: true,
        data: error,
      });
    }
  } else {
    res.status(404).send('Invalid request');
  }
});

// Citanje, Izmena i Brisanje odredjenog korisnika
router.route('/:user_id')
  // Pronadji korisnika sa user_id (GET http://localhost:3000/api/users/:user_id)
  .get((req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) res.status(400).send(err);
      res.status(200).json(user);
    });
  })
  // izmeni korisnika sa user_id (PUT http://localhost:3000/api/users/:user_id)
  .put((req, res) => {
    // prvo pronadji korisnika pomocu User modela

    // FIXME: REFACTOR THIS!!!!
    User.findById(req.params.user_id, (err, user) => {
      if (err) res.status(400).send(err);
      // pripremi parametre
      user.fullName = req.body.fullName;
      user.email = req.body.email;
      user.password = req.body.password;
      // i sacuvaj izmene
      user.save((_err) => {
        if (_err) res.status(400).send(_err);
        res.status(200).json({ message: 'Promene su sačuvane.' });
      });
    });
  })
  // Brisanje korisnika sa user_id (DELETE http://localhost:3000/api/users/:user_id)
  .delete((req, res) => {
    User.deleteOne({
      _id: req.params.user_id,
    }, (err, user) => {
      if (err) res.status(400).send(err);
      res.status(200).json({ message: `Korisnik ${user} je obrisan!` });
    });
  });

module.exports = router;
