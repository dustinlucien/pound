$(document).ready(function() {
  var socket = new io.Socket(null);
  socket.connect();

  var json = JSON.stringify;
  
  $('#bump').bind('click', function() {
    //gather the data
    
    var bump_data = {
      you: $('#bump_from').val(),
      context: $('#bump_for').val(),
      them: $('#bump_to').val()
    }
    
    socket.send(json(bump_data));     
  });

  socket.on('connect', function(){
  });

  socket.on('message', function(data){
    var person = JSON.parse(data);
    
    var element = "<li><div id=\"" + person.handle + 
                  "\"><img src=\"" + person.profile_image_url + 
                  "\" /><br/><span>" + person.bumps + " Bumps</span></div></li>";
                  
    $('#reciever').prepend(element);
  });

  socket.on('disconnect', function(){
  });
});