const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({
  title :{
    type: String,
    required : [ true, 'Title required' ]
  },
  description :{
      type : String,
      required : [ true, 'Description required']
  },
  created_at :{
    type: Date,
    default : Date.now
  },
  created_by :{
    type : Schema.Types.ObjectId
  }
})

const User = mongoose.model('Jobs', jobSchema)
module.exports = Job
