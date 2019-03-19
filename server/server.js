const express = require('express'); // glavna biblioteka za server
const bodyParser = require('body-parser'); // omogucava detekciju JSON podataka
const morgan = require('morgan'); // console logger komunikacija
const cors = require('cors'); // otklanja Cross Origin greske
const mongoose = require('mongoose'); // mongoDB drajver
const config = require('./config'); // konfiguracijski fajl sa parametrima za server

const app = express(); // inicijalizacija servera

const port = process.env.PORT || config.serverPort; // uzima port iz produkc. servera ili mog fajla

// povezivanje sa mongo bazom
mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true });

// app.set('superSecret', config.secret);  // postavlja zastitu za auth

// TODO: ovde dodaj dozvoljene adrese i uslove iz config fajla
app.use(cors({
  origin: (origin, callback) => {
    if (config.allowedIPs.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin: ${origin} is not allowed by CORS`));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
})); // inicijalizacija cors funkcija

// konfigurisanje bodyParser() za prikupljanje podataka iz POST metoda
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev')); // pokreni morgan development logger

// DEFINICIJE RUTA
// =============================================================================
const mainRouter = express.Router();
const usersRouter = require('./app/routes/usersroute');
const timersRouter = require('./app/routes/timersroute');

// test route (GET http://localhost:3000/api)
mainRouter.get('/', (req, res) => {
  res.json({ message: 'TimeTracking-app CRUD API' });
});

// middleware to use for all requests
/* router.use((req, res, next) => {
  // do validations here to make sure that everything coming from a request is safe

  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks expiration
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}); */

// AKTIVACIJA RUTA -------------------------------
app.use('/api', mainRouter);
app.use('/api/users', usersRouter);
app.use('/api/timers', timersRouter);

// START
// =============================================================================
app.listen(port, () => {
  if (!process.env.PORT) console.log(`Express server listening on http://localhost:${port}`);
});
