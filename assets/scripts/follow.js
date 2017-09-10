'use strict';

var uid = $("#uid").val();
var type = $("#type").val();

var pg = 1;
for (; pg <= 5; pg++) {
    $.get("/biliapi_" + type + "?uid=" + uid + "&pn=" + pg, function(result) {
        var i = 0;
        for (; i < result.data.list.length; i++) {
            var d = new Date(1000 * result.data.list[i].mtime);
            var markup = "<tr><td>" + result.data.list[i].mid + "</td>" +
                             "<td>" + result.data.list[i].uname + "</td>" +
                             "<td>" + d.getFullYear() + "-" + (d.getMonth() + 1) +
                                "-" + d.getDate() + " </td>" +
                             "<td>" + result.data.list[i].sign + "</td></tr>";
            $("table tbody").append(markup);
        }
    });
}

