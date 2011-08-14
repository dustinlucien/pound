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
      have: {type: Number, min: 0, default: 25}
      sent: [Kudo]
      received: [Kudo]

User.post('save', (next) ->
  console.log('just saved a user')
  console.log(arguments)
  
  if this.isNew
    console.log('the user is brand new')
  else
    console.log('the user already existed')
  
  next()
)

mongoose.model 'User', User
