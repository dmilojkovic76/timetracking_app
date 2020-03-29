/* eslint-disable no-console */
const express = require('express'); // glavna biblioteka za server
const volleyball = require('volleyball'); // console logger komunikacija
const cors = require('cors'); // otklanja Cross Origin greske
const mongoose = require('mongoose'); // mongoDB drajver
const config = require('./config'); // konfiguracijski fajl sa parametrima za server

const app = express(); // inicijalizacija servera

const port = process.env.PORT || config.serverPort; // uzima port iz produkc. servera ili mog fajla

// app.use(morgan('dev')); // pokreni morgan development logger
app.use(volleyball);

// povezivanje sa mongo bazom
mongoose.connect(config.database,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch((err) => { console.log(err); });

// app.set('superSecret', config.secret);  // postavlja zastitu za auth

// podesavanja za cors se ucitavaju iz config fajla
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

app.use(express.json()); // ranije je trebalo instalirati body-parser paket

// DEFINICIJE RUTA
// =============================================================================
const mainRouter = express.Router();
const usersRouter = require('./app/routes/usersroute');
const timersRouter = require('./app/routes/timersroute');

// test route (GET http://localhost:3000/api)
mainRouter.get('/', (req, res) => {
  res.json({ message: 'TimeTracking-app CRUD API' });
});

// AKTIVACIJA RUTA -------------------------------
app.use('/api', mainRouter);
app.use('/api/users', usersRouter);
app.use('/api/timers', timersRouter);

// START
// =============================================================================
app.listen(port, () => {
  if (!process.env.PORT) console.log(`Express server listening on http://localhost:${port}`);
});
