'use strict';

$.get("/page?aid=" + $("#aid").val(), function(data) {
    $("#title").text(data.title);
    $("#time").text(data.time);
    $("#class").text(data.class1 + " > " + data.class2 + " > " + data.class3);
    $("#description").text(data.description);
    $("#upName").text(data.upName);
    $("#upSign").text(data.upSign);
    $("#upAvatar").attr("src", data.upAvatar);
});
