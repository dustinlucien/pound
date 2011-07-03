class Kudos extends Backbone.Model
  defaults: ->
    message: ""
    context: ""
    from : null
    to : null
    
  getMessage: ->
    @get('message')
    
  getContext: ->
    @get('context')
    
  getFrom: ->
    @get('from')
    
  getTo: ->
    @get('to')
  
class User extends Backbone.Model
  defaults: ->
    firstname:""
    lastname:""
    twitter:null
    recieved:0
    balance:25
    
  getFirstname: ->
    @get('firstname')
    
  getLastname: ->
    @get('lastname')
    
  getTwitterUsername: ->
    @get('twitter')
  
  getTwitterProfileUrl: ->
    "http://api.twitter.com/1/users/show/#{@getTwitterUsername()}.json"
    
  getTotalKudos: ->
    @get('recieved')
  
  getKudosRemaining: ->
    @get('balance')
  
  