const express = require('express'); // glavna biblioteka za server
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // create, sign, and verify jwt tokens
const config = require('../../config'); // konfiguracijski fajl sa parametrima za server

const router = express.Router();

const User = require('../models/users');

// Autorizacija korisnika (POST http://localhost:3000/api/users/sign-in)
router.post('/sign-in', (req, res) => {
  // prvo pronadji korisnika pomocu User modela
  // TODO: Trebalo bi uzeti u obzir da li vise korisnika ima isti email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(422).json({ success: false, message: 'Neuspešno prijavljivanje!' });
    } else if (user) {
      // proveri da li se sifre podudaraju
      bcrypt.compare(req.body.password, user.password)
        .then((result) => {
          if (result === false) {
            res.status(422).json({
              success: false,
              message: 'Neuspešno prijavljivanje!.',
            });
          } else { // ako imamo korisnika i lozinke se podudaraju kreiraj token i autorizuj
            const payload = { // kreiram payload samo sa imenom i emailom
              _id: user._id, // eslint-disable-line
              fullName: user.fullName,
              email: user.email,
            };
            // da ne bi poslao i lozinku jer jwt moze da se dekodira
            const token = jwt.sign(payload, config.secret, { expiresIn: '24h' });

            res.status(200).json({
              success: true,
              token,
              user: {
                fullName: user.fullName,
                email: user.email,
                id: user._id, // eslint-disable-line
              },
            });
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
      res.status(422).json({ success: false, message: 'Korisnik sa ovom e-mail adresom vec postoji!' });
    }
  });
});

// Izlistavanje svih korisnika (GET http://localhost:3000/api/users)
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) res.status(400).send(err);
    res.status(200).json(users);
  });
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
