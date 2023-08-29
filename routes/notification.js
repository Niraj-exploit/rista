const express = require('express');
const router = express.Router();
const { ensureAuthenticated_admin } = require("../config/auth");
const Notification = require('../models/Notification');



router.get('/adminPushNotification', ensureAuthenticated_admin, (req, res) => {
    res.render('admin/pushNotification', {
        user: req.user
    });
  });

// function fetchNotifications() {
//     return Notification.find().sort({ date: -1 }).limit(5);
//   }
  

//   router.use(async function (req, res, next) {
//     // Fetch notifications from the database
//     try {
//       const notifications = await Notification.find().sort({ date: -1 }).limit(5);
//       res.locals.notifications = notifications;
//     } catch (err) {
//       console.error('Error fetching notifications:', err);
//     }
//   });
  
  router.post('/pushNotification', (req, res) => {
    const { title, icon, to, color, description } = req.body;
    let errors = [];
  
    // Check required fields
    if (!title || !icon || !to || !color || !description) {
      errors.push({ msg: 'Please fill in all required fields' });
    }
  
    if (errors.length > 0) {
      res.render('admin/adminPushNotification', {
        errors,
        title,
        icon,
        to,
        color,
        description,
        user: req.user
      });
    } else {
      // Validation passed
      const newNotification = new Notification({
        title,
        icon,
        to,
        color,
        description
      });
  
      newNotification.save()
        .then(notification => {
          req.flash('success_msg', 'Notification pushed successfully');
          res.redirect('/viewNotifications?selectedItem=VIEW%20NOTIFICATION');
        })
        .catch(err => console.log(err));
    }
  });
  
  router.get('/viewNotifications', ensureAuthenticated_admin, async (req, res) => {
    const user = req.user;
  
    try {
      const notifications = await Notification.find({ to: user.role, 'to': { '$in': user.role }}).sort({ date: -1 });
  
      let view = 'admin/viewNotification'; 
  
      res.render(view, {
        notifications: notifications,
        user: user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/viewNotificationsDetail', ensureAuthenticated_admin, async (req, res) => {
    const user = req.user;
  
    try {
      const notifications = await Notification.find({ to: user.role, 'to': { '$in': user.role }}).sort({ date: -1 });
  
      let view = 'admin/viewNotificationDetail'; 
  
      res.render(view, {
        notifications: notifications,
        user: user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/doctor/viewNotifications', ensureAuthenticated_admin, async (req, res) => {
    const user = req.user;
  
    try {
      const notifications = await Notification.find({ to: user.role, 'to': { '$in': user.role }}).sort({ date: -1 });
  
      let view = 'doctor/viewNotificationDetail'; 
  
      res.render(view, {
        notifications: notifications,
        user: user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/doctor/viewNotifications', ensureAuthenticated_admin, async (req, res) => {
    const user = req.user;
  
    try {
      const notifications = await Notification.find({ to: user.role, 'to': { '$in': user.role }}).sort({ date: -1 });
  
      let view = 'patient/viewNotificationDetail'; 
  
      res.render(view, {
        notifications: notifications,
        user: user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  module.exports = router;