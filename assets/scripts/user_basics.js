'use strict';

var uid = $("#uid").val();
var type = $("#type").val();

$.get("/biliapi_userinfo?uid=" + uid, function(result) {
    $("title").text(result.data.name + " - Bilibili API");
    $("#title").text(result.data.name);console.log(result.data)
    if (type == "info") {
        var markup = "";
        var sex = result.data.sex.trim() == "" ? "未填写" : result.data.sex;
        var place = result.data.place.trim() == "" ? "未填写" : result.data.place;
        var d = new Date(1000 * result.data.regtime);
        var dstr = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var fans = result.data.fans_badge ? "已开通" : "未开通";
        markup += "<tr><td>" + "性别" + "</td><td>" + sex + "</td></tr>";
        markup += "<tr><td>" + "生日" + "</td><td>" + result.data.birthday.slice(5) + "</td></tr>";
        markup += "<tr><td>" + "地点" + "</td><td>" + place + "</td></tr>";
        markup += "<tr><td>" + "播放数" + "</td><td>" + result.data.playNum + "</td></tr>";
        markup += "<tr><td>" + "注册时间" + "</td><td>" + dstr + "</td></tr>";
        markup += "<tr><td>" + "粉丝勋章" + "</td><td>" + fans + "</td></tr>";
        $("table tbody").append(markup);
        $("#upAvatar").attr("src", result.data.face);
        $("#upName").text(result.data.name);
        $("#upSign").text(result.data.sign);
        
        var lvinfo = result.data.level_info;
        var percent = 100 * lvinfo.current_exp / lvinfo.next_exp;
        $(".level-head").text("LV" + lvinfo.current_level);
        $(".level-current").width(isNaN(percent) ? "100%" : (percent + "%"));
        if (isNaN(percent)) {
            $(".level-current").text(lvinfo.current_exp + "（已满级）");
        } else if (percent > 0.5) {
            $(".level-current").text(lvinfo.current_exp + "/" + lvinfo.next_exp);
        } else {
            $(".level-full").text(lvinfo.current_exp + "/" + lvinfo.next_exp).css("text-align", "right");
        }
    }
});

$.get("/biliapi_videoamount?uid=" + uid, function(result) {
    $("#video").text(result.data.video);
});

$.get("/biliapi_followamount?uid=" + uid, function(result) {
    $("#following").text(result.data.following);
    $("#follower").text(result.data.follower);
});
