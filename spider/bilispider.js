var mysql = require("mysql");
var http = require("http");

// Global static variable
var PARAM = ["view", "danmaku", "reply", "favorite", "coin", "share", "now_rank", "his_rank", "like", "no_reprint", "copyright"];

// Global dynamic variable
var av = 1;
var t; // setInterval function, set after db is connected
var timerCleared = false;
var rate_cur = 25;

// Database variable
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bili"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database.");
    
    // Check the last updated av number (multiple of 100)
    con.query("SELECT av FROM last_updated", function (err, result, fields) {
        if (err) throw err;
        av = Math.max(0, result[0].av - 100);    // Start from 100 items before
        console.log(av + " start from av" + av); // to avoid missing of updating 
    
        t = setInterval(httpGetVideoInfo, 1000 / rate_cur); // Start timer
        console.log(av + " starting at rate = " + rate_cur);

        setInterval(routine, 1000 * 60);         // Print progress every minute
    });
});

function resetTimer(hour, rate) {
    clearInterval(t);
    t = setInterval(httpGetVideoInfo, 1000 / rate);
    rate_cur = rate;
    console.log(av + " It is now over " + hour + "am Beijing time. " +
                "Setting rate = " + rate);
}

function routine() {
    console.log(av + " Routine check. Rate = " + rate_cur + ". Time: " + (new Date()));

    if (timerCleared) return; // Do NOT do the following when waiting for 403 release

    var d = new Date()                           // Set rate base on UTC+8 (Beijing) time
    var hour = (d.getUTCHours() + 8) % 24;
    if (hour < 2 && rate_cur != 30) {
        resetTimer(hour, 30);
    } else if (hour >= 2 && hour < 7 && rate_cur != 20) {
        resetTimer(hour, 20);
    } else if (hour >= 7 && hour < 10 && rate_cur != 30) {
        resetTimer(hour, 30);
    } else if (hour >= 10 && hour < 18 && rate_cur != 40) {
        resetTimer(hour, 40);
    } else if (hour >= 18 && rate_cur != 45) {
        resetTimer(hour, 45);
    }
}
function httpGetVideoInfo(aid=0) {
    var this_av;
    if (aid == 0) {
        this_av = av;
        av += 1;
    } else {
        this_av = aid;
        console.log(this_av + " Came with aid = " + this_av);
    }

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
                    t = setInterval(httpGetVideoInfo, 1000 / rate_cur);
                    console.log(av + " starting at rate = " + rate_cur);
                    timerCleared = false;
                }, 1000 * 60 * 10); // Receiving 403, retry 10 minutes later.
            }
            return;
        }

        var output = "";
        res.on('data', function(chunk) {
            output += chunk.toString();
        }).on('end', function() {
            var json = JSON.parse(output);

            if (json == null) { // JSON parse fail. 
                console.log(this_av + " JSON parse returns null. Original data is: " + output);
                return httpGetVideoInfo(this_av);
            }

            var insert = "(" + this_av + ", ";
            var update = "";
            if (json.code != 0) return;
                
            for (var i = 0; i < PARAM.length; i++) {
                var value = isNaN(json.data[PARAM[i]]) ? 0 : json.data[PARAM[i]];
                insert += value + ", ";
                update += "`" + PARAM[i] + "` = " + value + ", ";
            }
            insert += Math.floor((new Date()).getTime() / 1000) + ")";
            update += "`update` = " + Math.floor((new Date()).getTime() / 1000);

            var sql = "INSERT INTO avinfo VALUES " + insert;
            sql += " ON DUPLICATE KEY UPDATE " + update;
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(this_av + " ERROR WHEN UPDATING avinfo");
                    throw err;
                } else {
                    if (this_av % 100 == 0) {
                        var sql = "UPDATE last_updated SET av = " + this_av;
                        con.query(sql, function(err, result) {if (err) throw err;});
                        console.log(this_av + " " + result.affectedRows + " record(s) updated");
                    }
                }
            });
        });
    });
}
