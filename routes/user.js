'use strict';

var http = require("http");
var decompressResponse = require('decompress-response');
var DomParser = require('dom-parser');
var parser = new DomParser();

exports.getUserVideoList = function(req, res) {
    if (!req.query.uid) return res.render("error", {queryError: "uid"});
    else return res.render("user", {type: "video", uid: req.query.uid,
                                      scripts: ["user_amount", "user_video"]});
}

exports.getUserFollowing = function(req, res) {
    if (!req.query.uid) return res.render("error", {queryError: "uid"});
    else return res.render("user", {type: "followings", uid: req.query.uid,
                                      scripts: ["user_amount", "follow"]});
}

exports.getUserFollower = function(req, res) {
    if (!req.query.uid) return res.render("error", {queryError: "uid"});
    else return res.render("user", {type: "followers", uid: req.query.uid,
                                      scripts: ["user_amount", "follow"]});
}
