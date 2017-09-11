'use strict';

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http");
var server = http.createServer(app);

var nunjucks = require('nunjucks');
nunjucks.configure('public', { autoescape: true, express: app });

var video = require("./routes/video");
var user = require("./routes/user");
var api = require("./routes/api");

app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', __dirname);
app.set('view engine', 'html');                 // Can omit HTML extension

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.get("/", function(req, res) {
console.log(req.headers)
    res.render("index.html", {scripts: ["index"], isIndex: true});
});

app.get("/video", video.getVideoStat);
app.get("/videopage", video.getVideoPage);
app.get("/user", user.getUserVideoList);
app.get("/userfollowing", user.getUserFollowing);
app.get("/userfollower", user.getUserFollower);
app.get("/biliapi_videoamount", api.getUserVideoAmount);
app.get("/biliapi_followamount", api.getUserFollowAmount);
app.get("/biliapi_uservideo", api.getUserVideoList);
app.get("/biliapi_followers", api.getUserFollowerList);
app.get("/biliapi_followings", api.getUserFollowingList);

server.listen(3002, function(request, response) {
    console.log("Running on 127.0.0.1:%s", server.address().port);
});
