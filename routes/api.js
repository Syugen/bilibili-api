'use strict';

var http = require("http");
var querystring = require("querystring");
var decompressResponse = require('decompress-response');
var DomParser = require('dom-parser');
var parser = new DomParser();

exports.getVideoInfo = function(req, res) {
    if (!req.query.aid) {
        return res.send({error: "Missing parameter"});
    }
    var options = {
        host: "api.bilibili.com",
        path: "/archive_stat/stat?aid=" + req.query.aid
    };

    http.get(options, function(bilires) {
        if (bilires.statusCode != 200) {
            return res.send({errorCode: bilires.statusCode});
        }
        var output = "";
        bilires.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            getJijiInfo(req, res, JSON.parse(output));
        });
    });
}

function getJijiInfo(req, res, stat) {
    var options = {
        host: "www.jijidown.com",
        path: "/Api/AvToCid/" + req.query.aid
    };

    http.get(options, function(jijires) {
        if (jijires.statusCode != 200) {
            res.send({errorCode: jijires.statusCode});
        }
        var output = "";
        jijires.on('data', function(chunk) {
            output += chunk;
        }).on('end', function() {
            stat.jiji = JSON.parse(output);
            getWebpageInfo(req, res, stat);
        });
    });
}

function getWebpageInfo(req, res, stat) {
    var options = {
        host: "www.bilibili.com",
        path: "/video/av" + req.query.aid + "/"
    };

    http.get(options, function(webres) {
        webres = decompressResponse(webres);
        if (webres.statusCode != 200) {
            res.send({errorCode: webres.statusCode});
        }
        var output = "";
        webres.on('data', function(chunk) {
            output += chunk;
        }).on('end', function() {
            var dom = parser.parseFromString(output), json = {};
            try {
                var tm = dom.getElementsByClassName("tminfo")[0];
                json.title = dom.getElementsByTagName("h1")[0].getAttribute("title");
                json.time = dom.getElementsByTagName("time")[0].
                                getElementsByTagName("i")[0].innerHTML;
                json.class1 = tm.getElementsByTagName("a")[0].innerHTML;
                json.class2 = tm.getElementsByTagName("a")[1].innerHTML;
                json.class3 = tm.getElementsByTagName("a")[2].innerHTML;
                json.description = dom.getElementById("v_desc").innerHTML;
                json.upName = dom.getElementsByClassName("usname")[0].
                                  getElementsByTagName("a")[0].innerHTML;
                json.uid = dom.getElementsByClassName("usname")[0].
                               getElementsByTagName("a")[0].getAttribute("mid");
                json.upSign = dom.getElementsByClassName("sign")[0].innerHTML;
                json.upAvatar = dom.getElementsByClassName("upinfo")[0].
                                    getElementsByTagName("img")[0].getAttribute("data-fn-src");
                stat.web = json;
                stat.web.error = false;
                getUserVideoAmountInfo(req, res, stat);
            } catch(err) {
                stat.web = {error: true};
                return res.send(stat);
            }
        });
    });
}

function getUserVideoAmountInfo(req, res, stat) {
    var options = {host: "api.bilibili.com",
                   path: "/x/space/navnum?mid=" + stat.web.uid};
    http.get(options, function(data) {
        if (data.statusCode != 200) {
            return res.send({errorCode: data.statusCode});
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            stat.videoAmount = JSON.parse(output);
            getUserFollowerAmountInfo(req, res, stat);
        });
    });
}

function getUserFollowerAmountInfo(req, res, stat) {
    var options = {host: "api.bilibili.com",
                   path: "/x/relation/stat?vmid=" + stat.web.uid};
    http.get(options, function(data) {
        if (data.statusCode != 200) {
            return res.send({errorCode: data.statusCode});
        }
        var output = "";
        data.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            stat.followAmount = JSON.parse(output);
            return res.send(stat);
        });
    });
}

/*
exports.getVideoStat = function(req, res) {
    if (!req.query.aid) {
        return res.send({error: "Missing parameter"});
    }
    var options = {
        host: "api.bilibili.com",
        path: "/archive_stat/stat?aid=" + req.query.aid
    };
    httpPost(res, options);
}*/

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
