'use strict';

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var nunjucks = require('nunjucks');
var server = require('http').createServer(app);

nunjucks.configure('public', { autoescape: true, express: app });

app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.get("/", function(req, res) {
    res.render("index.html");
});

server.listen(3002, function(request, response) {
    console.log("Running on 127.0.0.1:%s", server.address().port);
});
