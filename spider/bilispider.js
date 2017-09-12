var mysql = require("mysql");
var http = require("http");

var av = 2300;
var RATE = 30;
var PARAM = ["view", "danmaku", "reply", "favorite", "coin", "share", "now_rank", "his_rank", "like", "no_reprint", "copyright"];

var t; // setInterval function, set after db is connected
var timerCleared = false;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bili"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database.");
    
    con.query("SELECT av FROM last_updated", function (err, result, fields) {
        if (err) throw err;
        av = Math.max(0, result[0].av - 100);
        console.log(av + " start from av" + av);
    
        t = setInterval(httpGetVideoInfo, 1000 / RATE);

        setInterval(function() {  // Print progress every minute
            console.log(av + " Routine progress checking. It is now " + (new Date()))
        }, 1000 * 60);
    });
});

function httpGetVideoInfo(aid=0) {
    var this_av;
    if (aid == 0) {
        this_av = av;
        av += 1;
    } else this_av = aid;

    var options = {
        host: "api.bilibili.com",
        path: "/archive_stat/stat?aid=" + this_av
    }

    var req = http.get(options, function(res) {
        if (res.statusCode != 200 && res.statusCode != 403) {
            console.log(this_av, res.statusCode);
            return httpGetVideoInfo(this_av);
        }

        if (res.statusCode == 403) {
            console.log(this_av, res.statusCode);
            if (this_av < av) {  // Set back to the earliest av that received 403
                av = this_av;
                console.log(this_av + " av set back to " + av);
            }
            if (!timerCleared) { // Reset the timer when first 403 received
                clearInterval(t);
                console.log(this_av + " timer cleared. It is now " + (new Date()));
                timerCleared = true;
                setTimeout(function() {
                    t = setInterval(httpGetVideoInfo, 1000 / RATE);
                    console.log(this_av + " New timer set. Starting again");
                    timerCleared = false;
                }, 1000 * 60 * 65); // Receiving 403, retry 65 minutes later.
            }
            return;
        }
        var output = "";
        res.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            var json = JSON.parse(output);
            var settings = "";
            if (json.code == 0) {
                for (var i = 0; i < PARAM.length; i++) {
                    var value = isNaN(json.data[PARAM[i]]) ? 0 : json.data[PARAM[i]];
                    settings += "`" + PARAM[i] + "` = " + value + ", ";
                }
                settings += "`update` = " + Math.floor((new Date()).getTime() / 1000);
            }
            else { // Usually 40003
                for (var i = 0; i < PARAM.length; i++) {
                    settings += "`" + PARAM[i] + "` = NULL, ";
                }
                settings += "`update` = " + Math.floor((new Date()).getTime() / 1000);
            }
            var sql = "UPDATE avinfo SET " + settings + " WHERE av = " + this_av;
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(this_av + " ERROR WHEN UPDATING avinfo");
                    throw err;
                } else {
                    if (this_av % 100 == 0) {
                        var sql = "UPDATE last_updated SET av = " + this_av;
                        con.query(sql, function(err, result) {if (err) throw err;})
                        console.log(this_av, result.affectedRows + " record(s) updated");
                    }
                }
            });
        });
    });
}
