class SendKudosView extends Backbone.View
  
  initialize: ->
    @model.bind 'change', @render
    
  events: {
    'click #bump' : 'submit'
  }
  
  submit: (e) ->
    @model.set {
      sender: @$('#bump_from').val(),
      message: @$('#bump_for').val(),
      recipient: @$('#bump_to').val()
    }
    
    @model.trigger('change')
    
  render: ->
    $('#reciever').prepend("<li>sent another one</li>");