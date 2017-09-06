'use strict';

var searching = {};

searching.init = function() {
    $('#searchSubmit').submit(function(event) {
        event.preventDefault();
        window.location = '/search?content=' + $('#searchContent').val();
    });
};


$(document).ready(function() {
    searching.init();
});
