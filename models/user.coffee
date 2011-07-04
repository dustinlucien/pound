class User extends Backbone.Model
  defaults: ->
    firstname:""
    lastname:""
    twitter:null
    recieved:0
    balance:25
    
  firstname: ->
    @get('firstname')
    
  lastname: ->
    @get('lastname')
    
  twitter: ->
    @get('twitter')
  
  twitter_profile_url: ->
    "http://api.twitter.com/1/users/show/#{@twitter()}.json"
    
  total_kudos: ->
    @get('recieved')
  
  kudos_remains: ->
    @get('balance')
  
class UserList extends Backbone.Collection
  model: User