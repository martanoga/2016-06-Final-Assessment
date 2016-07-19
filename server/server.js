var express = require('express');
var session = require('express-session');
var request = require('request');
var bodyParser = require('body-parser')
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

var config = require('../config.js');
var db = require('./db/config.js');
var Users = require('./db/users.js');

var port = 3000;


var app = express();
app.use(bodyParser.json())

app.use(express.static(__dirname + '/../client'));

app.use(session({ secret: 'mysecret' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GithubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK
}, function (accessToken, refreshToken, profile, done) {
    new Users({ 'user_id': profile.id }).fetch()
        .then(function (existingUser) {
            console.log(existingUser);
            if (!existingUser) {
                return new Users({ 'user_id': profile.id, 'username': profile.username }).save();
            } else {
                done(null, {
                    accessToken: accessToken,
                    profile: profile
                });
            }
        })
        .then(function (newUser) {
            console.log(newUser);
            done(null, {
                accessToken: accessToken,
                profile: profile
            });
        })
        .catch(function (err) {
            done(err, null);
        })

}));

passport.serializeUser(function (user, done) {
    // for the time being tou can serialize the user 
    // object {accessToken: accessTokdden, profile: profile }
    // In the real app you might be storing on the id like user.profile.iddd 
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    // If you are storing the whole user on session we can just pass to the done method, 
    // But if you are storing the user id you need to query your db and get the user 
    //object and pass to done() 
    done(null, user);
});

app.listen(port, function () {
    console.log("Server is listening on port", port);
});

app.get('/auth', passport.authenticate('github'));
app.get('/auth/callback',
    passport.authenticate('github', { failureRedirect: '/auth/error' }), function (req, res) {
        res.redirect('/#/token/' + req.session.passport.user.accessToken);
    }
);


app.get('/giphs', function (req, res) {
    var limit = 10;
    request.get({
        url: config.GIPHY_TRENDING_URL,
        qs: { api_key: config.GIPHY_PUBLIC_KEY, limit: limit },
    }, function (err, response, body) {
        if (err) {
            res.sendStatus('500');
        } else {
            res.json(JSON.parse(body).data)
        }
    });
})

app.post('/translate', function (req, res) {
    var toTranslate = req.body.s;
    request.get({
        url: config.GIPHY_TRANSLATE_URL,
        qs: { api_key: config.GIPHY_PUBLIC_KEY, s: toTranslate },
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (err, response, body) {
        if (err) {
            res.sendStatus('500');
        } else {

            res.json(JSON.parse(body).data);
        }
    });
})
