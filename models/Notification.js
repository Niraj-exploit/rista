const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is Required'
  },
  icon: {
    type: String,
    required: 'Icons is Required'
  },
  to: {
    type: String,
    required: 'To is Required'
  },
  color: {
    type: String,
    required: 'Color is Required'
  },
//   imageUrl: {
//     type: String
//   },
//   patientid: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
  date: {
    type: Date,
    default: Date.now
  }
})
// user_id : {
//   id : {
//       type : mongoose.Schema.Types.ObjectId,
//       ref : 'User'
//   }
// }
const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification;
