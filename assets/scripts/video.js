'use strict';

/* Case tree:
 * if (1. B站 HTTP 回应代码 == 200 且
 *     2. B站 API 中 stat.code == 0) // 视频信息找到
 *     从B站网页读取更多信息
 *     if (读取失败) 上传时间、分类、UP主签名 改为 “读取失败”
 *     else
 *         添加上传时间、分类、UP主签名信息
 *         if (1. 唧唧 HTTP 回应代码 ！= 200 或
 *             2. 唧唧 API 回应代码 != 0 或 // 可能是UP主禁止
 *             2. 唧唧 API 信息显示视频删除) // 一定是唧唧缓存过期
 *             将标题、简介、UP用户名、UP头像更新为网页摘取内容
 *         else 以上四项不变（即相信唧唧缓存正确）
 * else
 *     该 JS 不会被加载。不会请求唧唧
 */

$.get("/page?aid=" + $("#aid").val(), function(data) {
    // TODO handle non-200 error
    if (data.error) { // Parsing时出错
        $("#time").text("读取上传时间失败");
        $("#class").text("读取分类失败");
        $("#upSign").text("读取UP主签名失败");
        // Parsing错误一般仅发生在番剧和视频不存在的情况，而视频不存在时页面不加载，
        // 所以基本可以断定是番剧导致的，推断其特点为唧唧API返回空标题
        if ($("#title").text() == "") {
            document.title = "Bilibili API";
            $("#title").text("读取标题失败");
            $("#subtitle").text("这可能是某个番剧的一集，还没想到根据av号判断番剧的方法");
            $("#img").attr("alt", "读取缩略图失败");
        }
    } else {
        $("#time").text(data.time);
        $("#class").text(data.class1 + " > " + data.class2 + " > " + data.class3);
        $("#upSign").text(data.upSign);
        if ($("#jijifail").val() == 1 || $("#title").text().trim() == "该视频已被B站删除") {
            document.title = data.title + " - Bilibili API";
            $("#title").text(data.title);
            $("#description").text(data.description);
            $("#upName").text(data.upName);
            $("#upAvatar").attr("src", data.upAvatar);
            $("#img").attr("alt", "读取缩略图失败");// 是否可以从网页读取缩略图？
        }
    }

});

if ($( window ).width() > 737) {
    var bot = $("#stat").position().top + $("#stat").height();
    $("#list").height(bot - $("#list").position().top);
    $("#list li").css("margin-left", "30px").css("float", "left");
    $("#list li").width($("ol:first").width() / 2 - 60);
    $("#play").height($("#play").width() * 0.6);
}

$( window ).resize(function() {
    if ($( window ).width() > 737) {
        var bot = $("#stat").position().top + $("#stat").height();
        $("#list").height(bot - $("#list").position().top);
        $("#list li").css("margin-left", "30px").css("float", "left");
        $("#list li").width($("ol:first").width() / 2 - 60);
        $("#play").height($("#play").width() * 0.6);
    } else {
        $("#list").css("height", "");
        $("#list li").css("width", "").css("float", "");
    }
});
