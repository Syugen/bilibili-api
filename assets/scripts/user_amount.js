'use strict';

var uid = $("#uid").val();

$.get("/biliapi_videoamount?uid=" + uid, function(result) {
    $("#video").text(result.data.video);
});

$.get("/biliapi_followamount?uid=" + uid, function(result) {
    $("#following").text(result.data.following);
    $("#follower").text(result.data.follower);
});
