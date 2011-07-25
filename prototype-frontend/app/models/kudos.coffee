
Kudos = new mongoose.Schema
  id : Number
  message : String
  sender : [User]
  recipient : [User]
  created : Date
