/* eslint-disable no-console */
const express = require('express'); // glavna biblioteka za server
const cors = require('cors'); // otklanja Cross Origin greske
const mongoose = require('mongoose'); // mongoDB drajver
const dotenv = require('dotenv'); // konfiguracijski parametri iz okruzenja, tj. .env fajla
const volleyball = require('volleyball'); // console logger komunikacija
// eslint-disable-next-line no-unused-vars
const colors = require('colors'); // omogucava da console.log bude u boji

const app = express(); // inicijalizacija servera

dotenv.config({ path: './config/development.env' }); // ucitaj konfiguraciju

// app.use(morgan('dev')); // pokreni morgan development logger
app.use(volleyball); // pokreni volleyball console logger

// povezivanje sa mongo bazom
mongoose.connect(process.env.DB_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(conn => console.log(`Uspesno povezivanje sa bazom: ${conn.connection.host}`.yellow.bold))
  .catch((err) => { console.log(`${err}`.red); });

// app.set('superSecret', config.secret);  // PROBA postavlja zastitu za auth

// podesavanja za cors se ucitavaju iz config fajla
const CORS_ALLOWED_IPS = process.env.ALLOWED_IPS.split(',');
console.log(`Lista dozvoljenih adresa za pristup: ${CORS_ALLOWED_IPS}`);

// inicijalizacija cors funkcija za dozvoljene ip adrese
app.use(cors({
  origin: (origin, callback) => {
    if ((CORS_ALLOWED_IPS.indexOf(origin) !== -1) || (CORS_ALLOWED_IPS[0] === '*')) {
      callback(null, true);
    } else {
      callback(new Error(`Origin: ${origin} nije dozvoljen zbog CORS`.red));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(express.json()); // ranije je trebalo instalirati body-parser paket

// DEFINICIJE RUTA
// =============================================================================
const mainRouter = express.Router();
const usersRouter = require('./routes/usersroute');
const timersRouter = require('./routes/timersroute');

// @def     Test ruta
// @method  GET http://localhost:3000/api/v1
mainRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TimeTracking-app CRUD API v1',
  });
});

// AKTIVACIJA RUTA -------------------------------
app.use('/api/v1', mainRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/timers', timersRouter);

// START SERVER
// =============================================================================
const PORT = process.env.SERVER_PORT || 3003; // uzima port iz produkc. servera, mog fajla ili 3003

app.listen(PORT, () => {
  if (!process.env.SERVER_PORT) console.log(`Server u ${process.env.NODE_ENV} modu na http://localhost:${PORT}`.cyan.bold);
});
