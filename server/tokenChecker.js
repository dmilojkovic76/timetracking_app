/* eslint-disable no-console */
const jwt = require('jsonwebtoken');

// Middleware za proveru ispravnosti tokena svih poziva serveru
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization.split(' ')[1];

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
            error: err,
          },
        );
      }
      req.decoded = decoded;
      next();
    });
  } else {
    // Ako nema tokena vrati gresku
    console.log('Token nije prosledjen u zahtevu ili nije pronadjen!'.red);
    return res.status(401).send({
      sucess: false,
      message: 'Nije prosledjen validan JWToken.',
    });
  }
};
