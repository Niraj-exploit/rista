const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');

router.get('/usernames/:role', async (req, res) => {
    const { role } = req.params;
  
    try {
      let users = [];
  
      switch (role) {
        case 'patient':
          users = await Patient.find({}, 'name'); // Fetch usernames for patients
          break;
        case 'admin':
          users = await Admin.find({}, 'name'); // Fetch usernames for admins
          break;
        case 'doctor':
          users = await Doctor.find({}, 'name'); // Fetch usernames for doctors
          break;
        default:
          // Handle other cases
          break;
      }
  
      const names = users.map(user => user.name);
      res.json(names);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/user/:id', async (req, res) => {
    try {
      const sender = await User.findById(req.params.id);
      res.json(sender);
    } catch (error) {
      console.error('Error fetching sender:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Route to render the page with the form to send messages
router.get('/pushMessage', (req, res) => {
  // Render your EJS template for the message sending form
  res.render('admin/pushMessage',{
    user: req.user,
    title: 'Push Notification',
    messages: res.locals.messages
  });
});

// Route to handle sending the message
router.post('/send', async (req, res) => {
    const { recipientRole, recipientUsername, messageText } = req.body;
  
    // Find the sender user by their ID
    const sender = req.user; // Assuming the sender is the logged-in user
  
    let recipient;
    
    // Find the recipient based on the selected role
    if (recipientRole === 'admin') {
      recipient = await Admin.findOne({ name: recipientUsername });
    } else if (recipientRole === 'doctor') {
      recipient = await Doctor.findOne({ name: recipientUsername });
    } else if (recipientRole === 'patient') {
      recipient = await Patient.findOne({ name: recipientUsername });
    }
  
    if (!recipient) {
      // Handle if recipient doesn't exist
      return res.status(400).send('Recipient not found');
    }
  
    // Create a new message
    const newMessage = new Message({
      sender: sender._id,
      senderName: sender.name,
      senderImage: sender.imageUrl,
      recipient: recipient._id,
      message: messageText,
    });
  
    try {
      await newMessage.save();
      // Redirect or send a success response
      res.redirect('/dashboard'); // Redirect to the dashboard or another page
    } catch (err) {
      console.error(err);
      // Handle error and render an error page or send an error response
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;
