'use strict';

var uid = $("#uid").val();
var type = $("#type").val();

$.get("/biliapi_userinfo?uid=" + uid, function(result) {
    $("#title").text(result.data.name);console.log(result.data)
    if (type == "info") {
            //var d = new Date(1000 * result.data.list[i].mtime);
        var markup = "";
        var d = new Date(1000 * result.data.regtime);
        markup += "<tr><td>" + "性别" + "</td><td>" + result.data.sex + "</td></tr>";
        markup += "<tr><td>" + "生日" + "</td><td>" + result.data.birthday + "</td></tr>";
        markup += "<tr><td>" + "地点" + "</td><td>" + result.data.place + "</td></tr>";
        markup += "<tr><td>" + "播放数" + "</td><td>" + result.data.playNum + "</td></tr>";
        markup += "<tr><td>" + "排名" + "</td><td>" + result.data.rank == 10000 ? ">=" : "" + 
                                                      result.data.rank + "</td></tr>";
        markup += "<tr><td>" + "注册时间" + "</td><td>" + d.getFullYear() + "-" + (d.getMonth() + 1) +
                                                    "-" + d.getDate() + "</td></tr>";
        markup += "<tr><td>" + "" + "</td><td>" + result.data + "</td></tr>";
        markup += "<tr><td>" + "" + "</td><td>" + result.data + "</td></tr>";
        markup += "<tr><td>" + "" + "</td><td>" + result.data + "</td></tr>";
        markup += "<tr><td>" + "" + "</td><td>" + result.data + "</td></tr>";
        markup += "<tr><td>" + "" + "</td><td>" + result.data + "</td></tr>";
            $("table tbody").append(markup);
        $("#upAvatar").attr("src", result.data.face);
        $("#upName").text(result.data.name);
        $("#upSign").text(result.data.sign);

    }
});

$.get("/biliapi_videoamount?uid=" + uid, function(result) {
    $("#video").text(result.data.video);
});

$.get("/biliapi_followamount?uid=" + uid, function(result) {
    $("#following").text(result.data.following);
    $("#follower").text(result.data.follower);
});
