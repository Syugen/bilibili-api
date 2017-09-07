'use strict';

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http");
var server = http.createServer(app);

var nunjucks = require('nunjucks');
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
    res.render("index.html", {scripts: ["index"], isIndex: true});
});

app.get("/stat", function(req, res) {
    var options = {
        host: "api.bilibili.com",
        path: "/archive_stat/stat?aid=" + req.query.aid
    };

    var req2 = http.get(options, function(data) {
        if (data.statusCode != 200) {
            return res.send("Error while visiting bilibili.com. " +
                            "Status code is: " + data.statusCode);
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk;
        }).on('end', function() {
            var json = JSON.parse(output);
            return res.render("stat.html", {data: json, isSubpage: true});
        });
    });

    req2.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
});

server.listen(3002, function(request, response) {
    console.log("Running on 127.0.0.1:%s", server.address().port);
});
