class Kudos extends Backbone.Model
  defaults: ->
    message: ""
    sender : null
    recipient : null
    
  message: ->
    @get('message')
    
  sender: ->
    @get('sender')
    
  recipient: ->
    @get('recipient')

class KudosList extends Backbone.Collection
  model: Kudos
  
