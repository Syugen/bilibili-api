'use strict';

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http");
var server = http.createServer(app);

var decompressResponse = require('decompress-response');
var DomParser = require('dom-parser');
var parser = new DomParser();
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

app.get("/video", function(req, res) {
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
            var stat = JSON.parse(output);
            getInfo(req, res, stat);
        }).on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
    });
});

function getInfo(req, res, stat) {
    var options = {
        host: "www.jijidown.com",
        path: "/Api/AvToCid/" + req.query.aid
    };

    var req2 = http.get(options, function(data) {
        var output = "";
        data.on('data', function(chunk) {
            output += chunk;
        }).on('end', function() {
            var info = JSON.parse(output);
            info.time = new Date(info.time * 1000); // cache time
            var settings = {
                stat: stat,
                info: info,
                isSubpage: true,
                scripts: ["video"]
            };
            return res.render("video.html", settings);
        }).on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
    });
}

app.get("/page", function(req, res) {
    var options = {
        host: "www.bilibili.com",
        path: "/video/av" + req.query.aid + "/",
    };

    var req2 = http.get(options, function(data) {
        data = decompressResponse(data);
        if (data.statusCode != 200) {
            return res.send("Error while visiting bilibili.com. " +
                            "Status code is: " + data.statusCode);
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            var dom = parser.parseFromString(output), json = {};
            var tm = dom.getElementsByClassName("tminfo")[0];
            //json.title = dom.getElementsByTagName("h1")[0].getAttribute("title");
            json.time = dom.getElementsByTagName("time")[0].getAttribute("datetime");
            json.class1 = tm.getElementsByTagName("a")[0].innerHTML;
            json.class2 = tm.getElementsByTagName("a")[1].innerHTML;
            json.class3 = tm.getElementsByTagName("a")[2].innerHTML;
            //json.description = dom.getElementById("v_desc").innerHTML;
            //json.upName = dom.getElementsByClassName("usname")[0].
            //                  getElementsByTagName("a")[0].innerHTML;
            json.upSign = dom.getElementsByClassName("sign")[0].innerHTML;
            //json.upAvatar = dom.getElementsByClassName("upinfo")[0].
            //                    getElementsByTagName("img")[0].getAttribute("data-fn-src");
            return res.send(json);
        }).on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
    });
});

server.listen(3002, function(request, response) {
    console.log("Running on 127.0.0.1:%s", server.address().port);
});
