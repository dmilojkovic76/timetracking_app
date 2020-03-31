/* eslint-disable no-console */
const express = require('express'); // glavna biblioteka za server
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // create, sign, and verify jwt tokens
// eslint-disable-next-line no-unused-vars
const colors = require('colors'); // omogucava da console.log bude u boji

const router = express.Router();

const User = require('../models/users');

// Za pravu primenu ovo bi trebalo da bude nesto kao Redis a ne obican array
const tokenList = {};

function renewToken(token, userData) {
  const payload = {
    _id: userData.decoded._id, // eslint-disable-line
    fullName: userData.decoded.fullName,
    email: userData.decoded.email,
  };
  // generisem novi token
  const newToken = jwt.sign(
    payload,
    process.env.SECRET,
    { expiresIn: process.env.TOKEN_LIFE },
  );
  // osvezimo token u nasoj listi aktivnih tokena
  tokenList[token].data.token = newToken;
  return newToken;
}

function respondErr(status, res, err) {
  res.status(status).json(
    {
      success: false,
      message: 'Neuspešno prijavljivanje!',
      error: err,
    },
  );
}

// @def     Autorizacija korisnika
// @method  POST http://localhost:3000/api/v1/users/sign-in)
router.post('/sign-in', (req, res) => {
  // prvo pronadji korisnika pomocu User modela
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) respondErr(500, res, err);
    if (!user) {
      respondErr(422, res); // Namerno saljem genericku gresku zbog bezbednosti
    } else if (user) {
      // proveri da li se sifre podudaraju
      bcrypt.compare(req.body.password, user.password)
        .then((result) => {
          if (result === false) {
            respondErr(500, res);
          } else { // ako imamo korisnika i lozinke se podudaraju kreiraj token i autorizuj
            const payload = { // kreiram payload samo sa imenom i emailom
              _id: user._id, // eslint-disable-line
              fullName: user.fullName,
              email: user.email,
            };

            const token = jwt.sign(
              payload,
              process.env.SECRET,
              { expiresIn: process.env.TOKEN_LIFE },
            );
            // eslint-disable-next-line max-len
            const refreshToken = jwt.sign(
              payload,
              process.env.REFRESH_SECRET,
              { expiresIn: process.env.REFRESH_TOKEN_LIFE },
            );

            const response = {
              success: true,
              message: 'Korisnik je uspesno prijavljen',
              data: {
                token,
                refreshToken,
                user: {
                  fullName: user.fullName,
                  email: user.email,
                  id: user._id, // eslint-disable-line
                },
              },
            };

            tokenList[token] = response;
            console.log(tokenList);

            res.status(202).json(response);
          }
        });
    }
  });
});

// @def     Dodavanje korisnika
// @method  POST http://localhost:3000/api/v1/users/sign-up
router.post('/sign-up', (req, res) => {
  User.findOne({ email: req.body.email }, (err, pronadjen) => {
    if (err) respondErr(500, res, err);
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
            if (_err) {
              respondErr(400, res, err);
            }
          });
          res.status(201).json({
            success: true,
            message: 'Korisnik je uspesno kreiran!',
            data: {
              user: {
                fullName: user.fullName,
                email: user.email,
                id: user._id, // eslint-disable-line
              },
            },
          });
        });
    } else { // korisnik vec postojiExpress
      respondErr(422, res);
    }
  });
});

// Sve rute posle ovoga moraju da posalju token
router.use(require('../tokenChecker'));

// @def     Autorizacija korisnika
// @method  POST http://localhost:3000/api/v1/users/sign-out
router.post('/sign-out', (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization.split(' ')[1];
  try {
    // obrisemo token iz nase liste aktivnih tokena
    delete (tokenList[token]);
    const response = {
      success: true,
      message: 'Korisnik je odjavljen.',
    };
    res.status(200).json(response);
  } catch (err) {
    respondErr(500, res, err);
  }
});

// @def     Izlistavanje svih korisnikaExpress
// @method  GET http://localhost:3000/api/v1/users/all
router.get('/all', (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization.split(' ')[1];
  try {
    // obnovi token
    const newToken = renewToken(token, req);
    // eslint-disable-next-line array-callback-return
    User.find((err, users) => {
      if (err) {
        respondErr(400, res, err);
      } else {
        // prosledjujem novi token i trazene usere nazad
        const response = {
          sucess: true,
          message: 'Pretraga je uspela',
          data: {
            token: newToken,
            users,
          },
        };
        res.status(200).json(response);
      }
    });
  } catch (err) {
    respondErr(500, res, err);
  }
});

// Citanje, Izmena i Brisanje odredjenog korisnika
router.route('/:user_id')
  // @def     Citanje odredjenog korisnika
  // @method  GET http://localhost:3000/api/v1/users/user_id
  .get((req, res) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization.split(' ')[1];
    try {
      // obnovi token
      const newToken = renewToken(token, req);
      // Pronadji korisnika sa user_id
      User.findById(req.params.user_id, (err, user) => {
        if (err) {
          respondErr(400, res, err);
        } else {
          res.status(200).json(
            {
              sucess: true,
              message: 'Pretraga je uspela.',
              data: {
                token: newToken,
                user,
              },
            },
          );
        }
      });
    } catch (err) {
      respondErr(500, res, err);
    }
  })

  // @def     izmeni korisnika sa user_id
  // @method  PUT http://localhost:3000/api/v1/users/user_id
  .put((req, res) => {
    // prvo proveri da li je poslat token pa i da li ga imamo u listi aktivnih
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization.split(' ')[1];
    try {
      // obnovi token
      const newToken = renewToken(token, req);
      // FIXME: REFACTOR THIS!!!!
      User.findById(req.params.user_id, (err, user) => {
        if (err) {
          respondErr(400, res, err);
        }
        // pripremi parametre
        // eslint-disable-next-line no-param-reassign, max-len
        if (req.body.fullName && req.body.fullName !== user.fullName) user.fullName = req.body.fullName;
        // eslint-disable-next-line no-param-reassign
        if (req.body.email && req.body.email !== user.email) user.email = req.body.email;
        if (req.body.password) {
          bcrypt.hash(req.body.password, 12)
            .then((hashedPassword) => {
              // eslint-disable-next-line no-param-reassign
              user.password = hashedPassword;
            });
        }
        // i sacuvaj izmene
        user.save((_err) => {
          if (_err) {
            respondErr(422, res, err);
          } else {
            res.status(200).json(
              {
                success: true,
                message: 'Promene podataka za datog korisnika su sačuvane.',
                data: {
                  token: newToken,
                  user,
                },
              },
            );
          }
        });
      });
    } catch (err) {
      respondErr(500, res, err);
    }
  })

  // @def     Brisanje korisnika sa user_id
  // @method  DELETE http://localhost:3000/api/v1/users/user_id
  .delete((req, res) => {
    try {
      User.deleteOne({ _id: req.params.user_id }, (err, user) => {
        if (err) {
          respondErr(400, res, err);
        }
        res.status(200).json(
          {
            success: true,
            message: `Korisnik ${user} je obrisan!`,
          },
        );
      });
    } catch (err) {
      respondErr(500, res, err);
    }
  });

module.exports = router;
