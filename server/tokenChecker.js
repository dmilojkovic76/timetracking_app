/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // konfiguracijski parametri iz okruzenja, tj. .env fajla

dotenv.config({ path: './config/development.env' }); // ucitaj konfiguraciju

// Middleware za proveru ispravnosti tokena svih poziva serveru
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    // proveri token i validnost
    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json(
          {
            success: false,
            message: 'Neautorizovan pristup.',
          },
        );
      }
      console.log('Dekodiran token: ', decoded);
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      sucess: false,
      message: 'JWT nije prosledjen.',
    });
  }
};
