// server.js

// BASE SETUP
// =============================================================================
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var morgan     = require('morgan');             // logs requests to the console
var cors       = require('cors');

var jwt        = require('jsonwebtoken');       // create, sign, and verify jwt tokens
var config     = require('./config');

var User       = require('./app/models/users');
var Timer      = require('./app/models/timers');

var port = process.env.PORT || 8080;
mongoose.connect(config.database, {useNewUrlParser: true});
app.set('superSecret', config.secret);

app.use(cors());

// configure app to use bodyParser() that will allow to get the data from a POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// ROUTES FOR API
// =============================================================================
var router = express.Router();                  // get an instance of the express Router

router.post('/sign-up', (req, res) => {
    // create a user (accessed at POST http://localhost:8080/api/sign-up)
        var user = new User();      // create a new instance of the User model
        user.fullName = req.body.fullName;  // set the User name (comes from the request)
        user.email = req.body.email;  // set the User email (comes from the request)
        user.password = req.body.password;  // set the User password (comes from the request)
        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'user created!' });
        });
});

// route to authenticate a user (POST http://localhost:8080/api/sign-in)
router.post('/sign-in', function(req, res) {
    // find the user
    User.findOne({ email: req.body.email }, function(err, user) {
        console.log(`Pretraga za ${req.body.email} rezultat ${user}`)
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {  
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // if user is found and password is right
                // create a token with only given payload
                // don't pass it the entire user since that alse has the password
                const payload = { email: user.email };
                var token = jwt.sign(payload, app.get('superSecret'), { expiresIn: "24h" });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

// middleware to use for all requests
router.use(function(req, res, next) {
    // do validations here to make sure that everything coming from a request is safe

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks expiration
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
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
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'TimeTracking-app RESTful API' });   
});

// more routes for API will happen here

// This route is protected and will require a token.
router.route('/users')
    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// on routes that end in /users/:user_id
// ----------------------------------------------------
// This route is protected and will require a token.
router.route('/users/:user_id')
    // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {
        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            user.email = req.body.email;  // update the user info
            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });
        });
    })
    // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {
        User.deleteOne({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'User successfully deleted!' });
        });
    });

    router.route('/timers')
    // This route is protected and will require a token.
    // create a timer (accessed at POST http://localhost:8080/api/timers)
    .post(function(req, res) {
        var timer = new Timer();      // create a new instance of the Timer model
        timer.userId = req.body.userId;  // set the User ID (comes from the request)
        if (req.body.startTime) timer.startTime = req.body.startTime;  // set the time (comes from the request)
        if (req.body.endTime) timer.endTime = req.body.endTime;  // set the time (comes from the request)
        // save the timer and check for errors
        timer.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Timer created!' });
        });
    })
    // get all the timers (accessed at GET http://localhost:8080/api/timers)
    .get(function(req, res) {
        Timer.find(function(err, timers) {
            if (err)
                res.send(err);
            res.json(timers);
        });
    });

// on routes that end in /timers/:timer_id
// ----------------------------------------------------
// This route is protected and will require a token.
router.route('/timers/:timer_id')
    // get the timer with that id (accessed at GET http://localhost:8080/api/timers/:timer_id)
    .get(function(req, res) {
        Timer.findById(req.params.timer_id, function(err, timer) {
            if (err)
                res.send(err);
            res.json(timer);
        });
    })
    // update the timer with this id (accessed at PUT http://localhost:8080/api/timers/:timer_id)
    .put(function(req, res) {
        // use our timer model to find the timer we want
        Timer.findById(req.params.timer_id, function(err, timer) {
            if (err)
                res.send(err);
            timer.endTime = req.body.endTime;  // update the timer info
            // save the timer
            timer.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Timer updated!' });
            });
        });
    })
    // delete the timer with this id (accessed at DELETE http://localhost:8080/api/timers/:timer_id)
    .delete(function(req, res) {
        Timer.deleteOne({
            _id: req.params.timer_id
        }, function(err, timer) {
            if (err)
                res.send(err);
            res.json({ message: 'Timer successfully deleted!' });
        });
    });

// REGISTER ROUTES -------------------------------
// all of the routes will be prefixed with /api
// This route is protected and will require a token.
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);