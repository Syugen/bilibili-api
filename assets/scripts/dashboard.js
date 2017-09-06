'use strict';

var dashboard = {};


//append search result at search.html by using res.render() , using template
//need to specify the template of search.html

dashboard.init = function() {
    $("#info-form").submit(function(event) {
        event.preventDefault();
        let json_info = $(this).serializeArray(), json_time = $("#time-form").serializeArray();
        let json_submit = {}, cells = [];
        for (let i = 0; i < json_info.length; i++)
            json_submit[json_info[i].name] = json_info[i].value;
        for (let i = 0; i < json_time.length; i++) {
            if (json_time[i].name === "course")
                json_submit["course"] = json_time[i].value;
            else {
                let name = json_time[i].name;
                let d = name.slice(0, 4) + "-" + name.slice(4, 6) + "-" + name.slice(6, 8);
                let date = new Date(d);
                date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                date.setHours(name.substring(9));
                cells.push(date);
            }
        }
        json_submit.cells = JSON.stringify(cells);
        $.post("/postOrder", json_submit, function(result) {
            let status = result.status;
            if (status === 1) $("#form-feedback").text("To be implemented");
            else if (status === 0) {
                $("#form-feedback").text("Ordered successfully");
            }
        });
    });

    if($("#phone-input").length) $("#phone-input").mask("(999) 999-9999");
}

$(document).ready(function() {
    dashboard.init();
});
