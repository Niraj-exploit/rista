const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

const {
    ensureAuthenticated_doctor
} = require('../config/auth');

const Doctor = require('../models/Doctor');

// const {
//     db
// } = require('../models/RegNum')

var i;
var answer = [];
// db.collection("RegNum").findOne({}, function (err, result) {
//     if (err) throw err;
//     var len = result.regnum_doctor.length;
//     //console.log(len);
//     for (i = 0; i < len; i++) {
//         answer.push(result.regnum_doctor[i]);
//         //console.log(answer);
//     }
//     // console.log(answer);
// })



//passport config
require('../config/passport');

// login page
router.get('/Dlogin', (req, res) => res.render('doctor/logindr'));

//register page
// router.get('/Dregister', (req, res) => res.render('registerdr'));

// register handle

//doctor login handle  
router.post('/Dlogin',
    passport.authenticate('doctor', {
        successRedirect: '/doctordashboard',
        failureRedirect: '/doctor/Dlogin',
        failureFlash: true
    }));

    router.get('/notifications', (req, res) => {
        Notification.find()
          .sort({ date: -1 }) // Sort by date in descending order
          .then(notifications => {
            res.render('your_notification_template', {
              notifications: notifications
            });
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
      });
      
// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});


module.exports = router;