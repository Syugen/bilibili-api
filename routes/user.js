'use strict';

var http = require("http");
var decompressResponse = require('decompress-response');
var DomParser = require('dom-parser');
var parser = new DomParser();

exports.getUserPage = function(req, res) {
    var n = req.query.page ? req.query.page : 1;
    var options = {
        host: "space.bilibili.com",
        path: "/ajax/member/getSubmitVideos?mid=" + req.query.uid + "&pagesize=150&tid=0&page=1&order=pubdate",
    };

    var req = http.get(options, function(data) {
        data = decompressResponse(data);
        if (data.statusCode != 200) {
            return res.send({errorCode: data.statusCode});
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            return res.render("user.html", JSON.parse(output));
        });
    });
}

