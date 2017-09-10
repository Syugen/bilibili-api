'use strict';

$("#form").submit(function(event) {
    event.preventDefault();
    if ($("#av").prop("checked")) {
        window.location = "/video?aid=" + $("#id").val();
    } else if ($("#up").prop("checked")) {
        window.location = "/user?uid=" + $("#id").val();
    }
});
