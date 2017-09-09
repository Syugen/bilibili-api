'use strict';

$("#form").submit(function(event) {
    event.preventDefault();
    window.location = "/video?aid=" + $("#aid").val();
});
