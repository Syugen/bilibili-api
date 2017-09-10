'use strict';

var http = require("http");
var decompressResponse = require('decompress-response');
var DomParser = require('dom-parser');
var parser = new DomParser();

exports.getVideoStat = function(req, res) {
    var options = {
        host: "api.bilibili.com",
        path: "/archive_stat/stat?aid=" + req.query.aid
    };

    var req2 = http.get(options, function(data) {
        if (data.statusCode != 200) {
            return res.render("video", {errorCode: data.statusCode});
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk;
        }).on('end', function() {
            var stat = JSON.parse(output);
            if (stat.code != 0) {
                return res.render("video", {stat: stat});
            }
            getInfo(req, res, stat);
        });
    });
}

function getInfo(req, res, stat) {
    var options = {
        host: "www.jijidown.com",
        path: "/Api/AvToCid/" + req.query.aid
    };

    var req2 = http.get(options, function(data) {
        var settings = {
            stat: stat,
            isSubpage: true,
            scripts: ["video"]
        };
        if (data.statusCode != 200) {
            return res.render("video", settings);
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk;
        }).on('end', function() {
            var info = JSON.parse(output);
            info.time = new Date(info.time * 1000); // cache time
            settings.info = info;
            return res.render("video", settings);
        });
    });
}

exports.getVideoPage = function(req, res) {
    var options = {
        host: "www.bilibili.com",
        path: "/video/av" + req.query.aid + "/",
    };

    var req2 = http.get(options, function(data) {
        data = decompressResponse(data);
        if (data.statusCode != 200) {
            return res.send({error: true, errorCode: data.statusCode});
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            var dom = parser.parseFromString(output), json = {};
            try {
                var tm = dom.getElementsByClassName("tminfo")[0];
                json.title = dom.getElementsByTagName("h1")[0].getAttribute("title");
                json.time = dom.getElementsByTagName("time")[0].getAttribute("datetime");
                json.class1 = tm.getElementsByTagName("a")[0].innerHTML;
                json.class2 = tm.getElementsByTagName("a")[1].innerHTML;
                json.class3 = tm.getElementsByTagName("a")[2].innerHTML;
                json.description = dom.getElementById("v_desc").innerHTML;
                json.upName = dom.getElementsByClassName("usname")[0].
                                  getElementsByTagName("a")[0].innerHTML;
                json.upSign = dom.getElementsByClassName("sign")[0].innerHTML;
                json.upAvatar = dom.getElementsByClassName("upinfo")[0].
                                    getElementsByTagName("img")[0].getAttribute("data-fn-src");
                return res.send(json);
            } catch(err) {
                return res.send({error: true, data: output});
            }
        });
    });
}
