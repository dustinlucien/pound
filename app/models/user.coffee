mongoose = require('mongoose')
Kudo = require('./kudo')
Like = require('./like')

ObjectId = mongoose.Schema.ObjectId

User = new mongoose.Schema
  id : ObjectId
  username : String
  firstname : String
  lastname : String
  email : String
  password : String
  
  facebook:
    username : String
    token : String
    token_secret : String
      
  twitter : 
    username : String
    token : String
    token_secret : String

  linkedin :
    username : String
    token : String
    token_secret : String
    
  kudos:
      have: {type: Number, min: 0, 'default': 25}
      sent: [Kudo]
      received: [Kudo]

User.post('save', (doc) ->
  console.log('just saved a user')
  console.log('the user is brand new')
)

User.post('update', (doc) ->
  console.log('just updated a user')
  console.log('the user already existed')
)

mongoose.model 'User', User
