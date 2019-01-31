const express = require('express');

const router = express.Router();

const Timer = require('../models/timers');

router.route('/')
  // Kreiranje timera (POST http://localhost:8080/api/timers)
  .post((req, res) => {
    // kreiraj kopiju timera po Timer modelu, pa
    // ga podesi podacima iz request body-ja u kome su prosledjeni
    const timer = new Timer(req.body);
    // snimi timer i proveri da li ima gresaka
    timer.save((err) => {
      if (err) res.send(err);
      res.status(201).json({ message: 'Timer kreiran!' });
    });
  })
  // izlistaj sve timere (GET http://localhost:3000/api/timers)
  .get((req, res) => {
    Timer.find((err, timers) => {
      if (err) res.send(err);
      res.json(timers);
    });
  });

// Citanje, Izmena i Brisanje odredjenog korisnika
router.route('/:timer_id')
  // pronadji timer sa id (GET http://localhost:3000/api/timers/:timer_id)
  .get((req, res) => {
    Timer.findById(req.params.timer_id, (err, timer) => {
      if (err) res.send(err);
      res.json(timer);
    });
  })
  // izmeni timer sa id (PUT http://localhost:3000/api/timers/:timer_id)
  .put((req, res) => {
    // prvo pronadji timer pomocu Timer modela
    Timer.findById(req.params.timer_id, (err, timer) => {
      if (err) res.send(err);
      timer.endTime = req.body.endTime; // izmene samo za krajnje vreme
      // sacuvaj izmene
      timer.save((_err) => {
        if (_err) res.send(_err);
        res.json({ message: 'Promene su sačuvane.' });
      });
    });
  })
  // brisanje timera sa id (DELETE http://localhost:3000/api/timers/:timer_id)
  .delete((req, res) => {
    Timer.deleteOne({
      _id: req.params.timer_id,
    }
    , (err, timer) => {
      if (err) res.send(err);
      res.json({ message: 'Timer je obrisan!' });
    });
  });

module.exports = router;
