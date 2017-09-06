'use strict';
//Raymond Begins.........
var search = {};

search.init = function() {
  $("a[id^='add-course']").css("cursor", "pointer").click(function() { //button 'Add' listener
    var code = this.id.substring(11,this.id.length);
    $.post('/addCourse', {code: code},function(response){
      console.log(response); // make 'Success' as response here
      if(response == 'Success'){ //success indicates that the database was actually modified, preventing duplicate display
          $('#courseAdded-' + code).text('(Course added.)');
      }else{ //already in the database, i.e., database is not modified
          $('#courseAdded-' + code).text('(' + response + ')');
      }
    });
});

  $("a[id^='add-friend']").css("cursor", "pointer").click(function(){ //button 'Make friend' listener
    var username = this.id.substring(11,this.id.length);
    $.post('/makeFriends', {username: username}, function(response){
      console.log(response); //make 'Success' as response here
      if(response == 'Success'){ //success indicates that the database was actually modified, preventing duplicate display
          $('#friended-' + username).text('(You and ' + username + ' are now friends.)')
      }else{//already in the database,i.e., database is not modified
          $('#friended-' + username).text('(' + response + ')');
      }
    })
  })
}

$(document).ready(function() {
    search.init();
});
//Raymond Ends......
