'use strict';

var uid = $("#uid").val();

$("#video").on("DOMSubtreeModified", function() {
    var pg = 1, max_pg = Math.ceil($("#video").text() / 100);
    for (; pg <= max_pg; pg++) {
        $.get("/biliapi_uservideo?uid=" + uid + "&pn=" + pg, function(result) {
            var i = 0;
            for (; i < result.data.vlist.length; i++) {
                var d = new Date(1000 * result.data.vlist[i].created);
                var markup = "<tr><td>" + result.data.vlist[i].aid + "</td>" +
                                 "<td>" + result.data.vlist[i].title + "</td>" +
                                 "<td>" + d.getFullYear() + "-" + (d.getMonth() + 1) +
                                    "-" + d.getDate() + " </td>" +
                                 "<td>" + result.data.vlist[i].length + "</td>" +
                                 "<td>" + result.data.vlist[i].play + "</td>" +
                                 "<td>" + result.data.vlist[i].typeid + "</td>" +
                                 "<td>" + result.data.vlist[i].comment + "</td>" +
                                 "<td>" + result.data.vlist[i].favorites + "</td></tr>";
                $("table tbody").append(markup);
            }
        });
    }
});

/*
                                {% for item in data.vlist %}
                                <tr>
                                    <td>{{ item.aid }}</td>
                                    <td>{{ item.title }}</td>
                                    <td>{{ item.created }}</td>
                                    <td>{{ item.length }}</td>
                                    <td>{{ item.play }}</td>
                                    <td>{{ item.typeid }}</td>
                                    <td>{{ item.comment }}</td>
                                    <td>{{ item.favorites }}</td>
                                </tr>
                                {% endfor %}
*/
