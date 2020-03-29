const express = require('express');

const router = express.Router();

const Timer = require('../models/timers');

router.route('/')
  // Kreiranje timera (POST http://localhost:8080/v1/api/timers)
  .post((req, res) => {
    // kreiraj kopiju timera po Timer modelu, pa
    // ga podesi podacima iz request body-ja u kome su prosledjeni
    const timer = new Timer(req.body);
    // snimi timer i proveri da li ima gresaka
    timer.save((err) => {
      if (err) res.send(err);
      res.status(201).json(
        {
          sucess: true,
          message: 'Timer kreiran!',
          data: {
            timer,
          },
        },
      );
    });
  })

  // izlistaj sve timere (GET http://localhost:3000/v1/api/timers)
  .get((req, res) => {
    Timer.find((err, timers) => {
      if (err) res.send(err);
      res.json(
        {
          success: true,
          message: 'Lista timera za trazenog korisnika',
          data: {
            timers,
          },
        },
      );
    });
  });

// Citanje, Izmena i Brisanje odredjenog timera
router.route('/:timer_id')
  // pronadji timer sa id (GET http://localhost:3000/api/v1/timers/:timer_id)
  .get((req, res) => {
    Timer.findById(req.params.timer_id, (err, timer) => {
      if (err) res.send(err);
      res.status(200).json(
        {
          success: true,
          message: 'Pojedincni tajmer je pronadjen',
          data: {
            timer,
          },
        },
      );
    });
  })
  // izmeni timer sa id (PUT http://localhost:3000/api/v1/timers/:timer_id)
  .put((req, res) => {
    // prvo pronadji timer pomocu Timer modela
    Timer.findById(req.params.timer_id, (err, timer) => {
      if (err) res.send(err);
      timer.endTime = req.body.endTime; // izmene samo za krajnje vreme
      // sacuvaj izmene
      timer.save((_err) => {
        if (_err) res.send(_err);
        res.status(201).json(
          {
            success: 'True',
            message: 'Promene su sačuvane.',
            data: {
              timer,
            },
          },
        );
      });
    });
  })
  // brisanje timera sa id (DELETE http://localhost:3000/api/v1/timers/:timer_id)
  .delete((req, res) => {
    Timer.deleteOne({
      _id: req.params.timer_id,
    }, (err, timer) => {
      if (err) res.send(err);
      res.status(200).json(
        {
          success: true,
          message: 'Timer je obrisan!',
          data: {
            timer,
          }
        },
      );
    });
  });

module.exports = router;
