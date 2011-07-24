mongoose = require('mongoose')

ObjectId = mongoose.Schema.ObjectId

Kudo = new mongoose.Schema
  id : ObjectId
  message : String
  sender : ObjectId
  recipient : ObjectId
  gloms : [Kudo]
  likes : [Like]
  created : Date

mongoose.model 'Kudo', Kudo