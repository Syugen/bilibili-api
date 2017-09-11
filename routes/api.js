'use strict';

var http = require("http");
var decompressResponse = require('decompress-response');

exports.getUserVideoAmount = function(req, res) {
    if (!req.query.uid) {
        return res.send({error: "Missing parameter"});
    }
    var options = {host: "api.bilibili.com",
                   path: "/x/space/navnum?mid=" + req.query.uid};
    httpGet(res, options);
};

exports.getUserFollowAmount = function(req, res) {
    if (!req.query.uid) {
        return res.send({error: "Missing parameter"});
    }
    var options = {host: "api.bilibili.com",
                   path: "/x/relation/stat?vmid=" + req.query.uid};
    httpGet(res, options);
};

exports.getUserVideoList = function(req, res) {
    if (!req.query.uid || !req.query.pn) {
        return res.send({error: "Missing parameter"});
    }
    var options = {host: "space.bilibili.com",
                   path: "/ajax/member/getSubmitVideos?mid=" + req.query.uid +
                         "&pagesize=100&tid=0&page=" + req.query.pn};
    httpGet(res, options);
};

exports.getUserFollowerList = function(req, res) {
    if (!req.query.uid || !req.query.pn) {
        return res.send({error: "Missing parameter"});
    }
    var options = {host: "api.bilibili.com", 
                   path: "/x/relation/followers?vmid=" + req.query.uid + "&pn=" + req.query.pn};
    httpGet(res, options);
};

exports.getUserFollowingList = function(req, res) {
    if (!req.query.uid || !req.query.pn) {
        return res.send({error: "Missing parameter"});
    }
    var options = {host: "api.bilibili.com",
                   path: "/x/relation/followings?vmid=" + req.query.uid + "&pn=" + req.query.pn};
    httpGet(res, options);
};

function httpGet(res, options) {
        var req = http.get(options, function(data) {
        data = decompressResponse(data);
        if (data.statusCode != 200) {
            return res.send({errorCode: data.statusCode});
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            var rs = JSON.parse(output);
            return res.send(JSON.parse(output));
        });
    });
}
