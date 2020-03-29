/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const config = require('../config');


// Middlewade za proveru ispravnosti tokena svih poziva serveru
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    // proveri token i validnost
    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json(
          {
            error: true,
            message: 'Unauthorized access.',
          },
        );
      }
      console.log('Decoded token: ', decoded);
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      error: true,
      message: 'JWT nije prosledjen.',
    });
  }
};
