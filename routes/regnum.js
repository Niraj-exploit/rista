const express = require('express');
const router = express.Router();
const regnum = require('../models/RegNum');
const uuid = require('uuid');
const { ensureAuthenticated_admin } = require('../config/auth');

router.get('/generate', ensureAuthenticated_admin,(req, res) => {
  res.render('admin/generateRegNum', {
    token: null,
    user: req.user,
    notifications: res.locals.notifications,
  });
});

router.post('/store', ensureAuthenticated_admin, async (req, res) => {
  const expiration = new Date(Date.now() + 1 * 60 * 1000); // 1 min expiration time
  const userName = req.body.name;
  const randomComponent = uuid.v4();
  const token = `${randomComponent}`;

  try {
    const newRegistration = new regnum({
      token,
      expiration,
      userName,
    });

    await newRegistration.save();
    res.render('admin/generateRegNum', {
      token,
      user: req.user,
      notifications: res.locals.notifications,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while storing the registration number.' });
  }
});

router.get('/retrieve/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const registration = await regnum.findOne({ token });

    if (!registration) {
      res.status(404).json({ error: 'Registration number not found.' });
      return;
    }

    res.json({ token: registration.token, expiration: registration.expiration });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the registration number.' });
  }
});

router.post('/check-token-validity', async (req, res) => {
    const { tokennumber } = req.body;
  
    try {
      const existingToken = await regnum.findOne({ token: tokennumber });
  
      if (!existingToken) {
        res.json({ valid: false, message: 'Invalid registration number.' });
        return;
      }
  
      const currentTime = new Date();
      if (existingToken.expiration <= currentTime) {
        res.json({ valid: false, message: 'Token has expired.' });
        return;
      }
  
      // Check if token has been used before
      if (existingToken.used) {
          res.json({ valid: false, message: 'Token has already been used.' });
          await existingToken.remove();
        return;
      }
  
      // Mark token as used and delete it
      existingToken.used = true;
      await existingToken.save();
  
      res.json({ valid: true, message: 'Registration number is valid.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while checking the token number.' });
    }
  });
  

  // Add this route to your patient.js file
router.post('/get-username', async (req, res) => {
    const { tokennumber } = req.body;
  
    try {
      const existingToken = await regnum.findOne({ token: tokennumber });
  
      if (!existingToken) {
        res.json({ valid: false, message: 'Invalid registration number.' });
        return;
      }
  
      res.json({ valid: true, message: 'Registration number is valid.', username: existingToken.userName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while checking the token number.' });
    }
  });
  

module.exports = router;
