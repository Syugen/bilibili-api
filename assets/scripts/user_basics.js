'use strict';

var uid = $("#uid").val();
var type = $("#type").val();

$.get("/biliapi_userinfo?uid=" + uid, function(result) {
    $("#title").text(result.data.name);
    if (type == "info") {
        $("tbody").text("调整一下格式！\n"+JSON.stringify(result.data))
    }
});

$.get("/biliapi_videoamount?uid=" + uid, function(result) {
    $("#video").text(result.data.video);
});

$.get("/biliapi_followamount?uid=" + uid, function(result) {
    $("#following").text(result.data.following);
    $("#follower").text(result.data.follower);
});
