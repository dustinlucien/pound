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
    $('#reciever').append('<li>' + data + '</li>');
  });

  socket.on('disconnect', function(){
  });
});