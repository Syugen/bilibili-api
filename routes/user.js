'use strict';

var http = require("http");
var decompressResponse = require('decompress-response');
var DomParser = require('dom-parser');
var parser = new DomParser();

exports.getUserInfo = function(req, res) {
    if (!req.query.uid) return res.render("error", {queryError: "uid"});
    else return res.render("user", {type: "info", uid: req.query.uid,
                                    scripts: ["user_basics", "user_info"],
                                    styles: ["user_info"]});
}

exports.getUserVideoList = function(req, res) {
    if (!req.query.uid) return res.render("error", {queryError: "uid"});
    else return res.render("user", {type: "video", uid: req.query.uid,
                                    scripts: ["user_basics", "user_video"]});
}

exports.getUserFollowing = function(req, res) {
    if (!req.query.uid) return res.render("error", {queryError: "uid"});
    else return res.render("user", {type: "followings", uid: req.query.uid,
                                    scripts: ["user_basics", "follow"]});
}

exports.getUserFollower = function(req, res) {
    if (!req.query.uid) return res.render("error", {queryError: "uid"});
    else return res.render("user", {type: "followers", uid: req.query.uid,
                                    scripts: ["user_basics", "follow"]});
}
