const express = require('express');

const router = express.Router();

const Timer = require('../models/timers');

function respondErr(status, res, err) {
  return res.status(status).json({
    success: false,
    message: 'Greska prilikom obrade podataka!',
    error: err,
  });
}

// Sve rute posle ovoga moraju da posalju token
router.use(require('../tokenChecker'));

router.route('/')
  // @def     Kreiranje timera
  // @method  POST http://localhost:8080/v1/api/timers
  .post((req, res) => {
    // kreiraj kopiju timera po Timer modelu, pa
    // ga podesi podacima iz request body-ja u kome su prosledjeni
    const timer = new Timer(req.body);
    // snimi timer i proveri da li ima gresaka
    timer.save((err) => {
      if (err) respondErr(500, res, err);

      res.status(201).json(
        {
          sucess: true,
          message: 'Tajmer kreiran!',
          data: {
            timer,
          },
        },
      );
    });
  })

  // @def     izlistaj sve timere
  // @method  GET http://localhost:3000/v1/api/timers
  .get((req, res) => {
    // eslint-disable-next-line array-callback-return
    Timer.find((err, timers) => {
      if (err) respondErr(400, res, err);

      res.status(200).json(
        {
          success: true,
          message: 'Lista tajmera za trazenog korisnika.',
          data: {
            timers,
          },
        },
      );
    });
  });

// Citanje, Izmena i Brisanje odredjenog timera
router.route('/:timer_id')
  // @def     pronadji timer sa id
  // @method  GET http://localhost:3000/api/v1/timers/:timer_id
  .get((req, res) => {
    Timer.findById(req.params.timer_id, (err, time) => {
      if (err) respondErr(400, res, err);

      res.status(200).json(
        {
          success: true,
          message: 'Tajmer je pronadjen',
          data: {
            time,
          },
        },
      );
    });
  })

  // @def     izmeni timer sa id
  // @method  PUT http://localhost:3000/api/v1/timers/:timer_id
  .put((req, res) => {
    // prvo pronadji timer pomocu Timer modela
    Timer.findById(req.params.timer_id, (err, time) => {
      if (err) respondErr(400, res, err);

      // eslint-disable-next-line no-param-reassign
      time.endTime = req.body.endTime; // izmene samo za krajnje vreme
      // sacuvaj izmene
      time.save((_err) => {
        if (_err) respondErr(500, res, _err);
        res.status(201).json(
          {
            success: true,
            message: 'Promene su sačuvane.',
            data: {
              time,
            },
          },
        );
      });
    });
  })

  // @def     brisanje timera sa id
  // @method  DELETE http://localhost:3000/api/v1/timers/:timer_id
  .delete((req, res) => {
    Timer.deleteOne({ _id: req.params.timer_id }, (err, time) => {
      if (err) respondErr(400, res, err);

      res.status(200).json(
        {
          success: true,
          message: 'Tajmer je obrisan!',
          data: {
            time,
          },
        },
      );
    });
  });

module.exports = router;
