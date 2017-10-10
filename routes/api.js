'use strict';

var http = require("http");
var querystring = require("querystring");

exports.getVideoStat = function(req, res) {
    if (!req.query.aid) {
        return res.send({error: "Missing parameter"});
    }
    var options = {
        host: "api.bilibili.com",
        path: "/archive_stat/stat?aid=" + req.query.aid
    };
    httpPost(res, options);
}

exports.getUserInfo = function(req, res) {
    if (!req.query.uid) {
        return res.send({error: "Missing parameter"});
    }
    var options = {host: "space.bilibili.com",
                   path: "/ajax/member/GetInfo",
                   method: "POST",
                   headers: {"Referer": "https://space.bilibili.com/" + req.query.uid + "/",
                             "Content-Type": "application/x-www-form-urlencoded"}};
    httpPost(res, options, {mid: req.query.uid});
};

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

function httpGet(myres, options) {
    var req = http.get(options, function(res) {
        if (res.statusCode != 200) {
            return myres.send({errorCode: res.statusCode});
        }
        var output = "";
        res.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            return myres.send(JSON.parse(output));
        });
    });
}

function httpPost(myres, options, postData) {
    var req = http.request(options, function(res) {
        if (res.statusCode != 200) {
            return myres.send({errorCode: res.statusCode});
        }
        var output = "";
        res.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            return myres.send(JSON.parse(output));
        });
    });
    req.write(querystring.stringify(postData));
    req.end();
}
