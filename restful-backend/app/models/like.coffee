mongoose = require('mongoose')

ObjectId = mongoose.Schema.ObjectId

Like = new mongoose.Schema
  id : ObjectId
  sender : ObjectId
  created : Date
  
mongoose.model 'Like', Like