const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
// //patient model
const Patient = require("../models/Patient");
// // doctor model
const Doctor = require("../models/Doctor");
const Report = require("../models/Report");
const AdminReport = require("../models/AdminReport");
const Availability = require("../models/Availability");

const { ensureAuthenticated_admin } = require("../config/auth");

// Search/view patients

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/viewpatients", ensureAuthenticated_admin, async (req, res) => {
  Patient.find().exec(async function (err, results) {
    //To count total number of patients
    var patientCount = results.length;

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
      await Patient.find(
        {
          name: regex,
        },
        function (err, patients) {
          // const patients =  await Patient.find({name:regex}){
          if (err) {
            //  Garnu jastai ho
            throw err;
          } else {
            if (patients.length < 1) {
              req.flash(
                "error_msg",
                "Sorry! Patient not found,please try again"
              );
              res.redirect("/viewpatients");
            } else {
              res.render("admin/adminviewpatients", {
                patientCount,
                patients: patients, //just patients yo line ma incase --->const patients
                user: req.user, //which is done above
              });
            }
          }
        }
      );
    } else {
      const patients = await Patient.find({});
      res.render("admin/adminviewpatients", {
        patientCount,
        patients,
        user: req.user,
      });
    }
  });
});

// view more details of patient

router.param("id", function (req, res, next, _id) {
  Patient.findOne(
    {
      _id,
    },
    function (err, details) {
      if (err) res.json(err);
      else {
        req.patient = details;
        next();
      }
    }
  );
});
router.param("id", function (req, res, next, patientid) {
  Report.find(
    {
      patientid,
    },
    function (err, reports) {
      if (err) res.json(err);
      else {
        req.reports = reports;
        next();
      }
    }
  );
});

router.param("id", function (req, res, next, toPatient) {
  AdminReport.find(
    {
      toPatient,
    },
    function (err, adminreports) {
      if (err) res.json(err);
      else {
        req.adminreport = adminreports;
        next();
      }
    }
  );
});

router.get("/viewpatients/:id", ensureAuthenticated_admin, (req, res) => {
  res.render("admin/adminPatientdetails", {
    patient: req.patient,
    user: req.user,
  });
});

//To see patient uploads
router.get(
  "/viewpatients/:id/patientUploads",
  ensureAuthenticated_admin,
  async (req, res) => {
    res.render("patientUploads", {
      role: "Admin",
      images: req.reports,
      patient: req.patient,
      user: req.user,
      
    });
  }
);
8
router.get(
  "/viewpatients/:id/hospitalUploads",
  ensureAuthenticated_admin,
  (req, res) => {
    res.render("hospitalUploads", {
      role: "Admin",
      patient: req.patient,
      adminimages: req.adminreport,
      user: req.user,
    });
  }
);

// Search/view doctors

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/viewdoctors", ensureAuthenticated_admin, async (req, res) => {
  Doctor.find().exec(async function (err, results) {
    var doctorCount = results.length;

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
      await Doctor.find(
        {
          name: regex,
        },
        function (err, doctors) {
          // const doctors =  await Doctor.find({name:regex}){
          if (err) {
            //  Garnu jastai ho
            throw err;
          } else {
            if (doctors.length < 1) {
              req.flash(
                "error_msg",
                "Sorry! Doctor not found,please try again"
              );
              res.redirect("/viewdoctors");
            } else {
              res.render("admin/adminviewdoctors", {
                doctorCount,
                doctors: doctors, //just doctors yo line ma incase --->const doctors
                user: req.user, //which is done above
              });
            }
          }
        }
      );
    } else {
      const doctors = await Doctor.find({});
      res.render("admin/adminviewdoctors", {
        doctorCount,
        doctors,
        user: req.user,
      });
    }
  });
});

// view more details of doctor

router.param("id", function (req, res, next, _id) {
  Doctor.findOne(
    {
      _id,
    },
    function (err, details) {
      if (err) res.json(err);
      else {
        req.doctor = details;
        next();
      }
    }
  );
});

router.param("id", function (req, res, next, doctorid) {
  Availability.findOne(
    {
      doctorid,
    },
    function (err, availability) {
      if (err) res.json(err);
      else {
        req.availability = availability;
        next();
      }
    }
  );
});

router.get("/viewdoctors/:id", ensureAuthenticated_admin, (req, res) => {
  res.render("admin/adminDoctordetails", {
    availability: req.availability,
    doctor: req.doctor,
    user: req.user,
  });
});

//To update doctor
router.get("/updatedoctor/:id", ensureAuthenticated_admin, (req, res) => {
  const doctorId = req.params.id;


  Doctor.findById(doctorId)
    .then(doctor => {
      if (!doctor) {
        return res.status(404).send("Doctor not found");
      }


      res.render("admin/adminUpdateDoctor", {
        doctor: doctor,
        user: req.user,
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});


router.post('/updatedoctor', (req, res) => {
  const {
    doctorId,
      name,
      email,
      password,
      password2,
      salutation,
      phonenumber,
      experience,
      speciality,
      qualification,
      gender,
  } = req.body;
  const {
      imageUrl = 'https://res.cloudinary.com/nazus/image/upload/v1587475204/cakut3nckczmbtfnhmsk.png'
  } = req.body;
  let errors = [];

  //check required fields
  if ( !name || !email || !salutation || !phonenumber || !experience || !speciality || !qualification || !gender) {
      errors.push({
          msg: 'Please fill in all required fields'
      });
  }

  //check password match
  if (password !== password2) {
      errors.push({
          msg: 'Passwords do not match'
      });
  }

  //check pass length
  if (password && password.length < 6) {
      errors.push({
          msg: 'Password length should be at least six characters'
      });
  }

  if (errors.length > 0) {
      res.render('admin/adminAddDoctor', { // Supposing the template name is 'adminAddDoctor'
          errors,
          doctor: req.doctor, // Assuming req.doctor contains the existing doctor data
          user: req.user
      });
  } else {
      // Validation passed
      Doctor.findById(doctorId)
          .then(doctor => {
              if (!doctor) {
                  // Handle error here if required
                  return res.status(404).send("Doctor not found");
              }

              doctor.name = name;
              doctor.email = email;
              doctor.salutation = salutation;
              doctor.phonenumber = phonenumber;
              doctor.experience = experience;
              doctor.speciality = speciality;
              doctor.qualification = qualification;
              doctor.gender = gender;
              doctor.imageUrl = imageUrl;

              if (password) {
                  // Hash password
                  bcrypt.genSalt(10, (err, salt) =>
                      bcrypt.hash(password, salt, (err, hash) => {
                          if (err) throw err;
                          // Set password to hash
                          doctor.password = hash;
                          // Save doctor
                          doctor.save()
                              .then(updatedDoctor => {
                                  req.flash('success_msg', 'Doctor information updated');
                                  res.redirect('/viewdoctors?selectedItem=VIEW DOCTORS'); 
                              })
                              .catch(err => console.log(err));
                      }));
              } else {
                  // Save doctor without updating password
                  doctor.save()
                      .then(updatedDoctor => {
                          req.flash('success_msg', 'Doctor information updated');
                          res.redirect('/viewdoctors?selectedItem=VIEW DOCTORS'); 
                      })
                      .catch(err => console.log(err));
              }
          })
          .catch(err => console.log(err));
  }
});


router.get("/adddoc", ensureAuthenticated_admin, (req, res) => {
  res.render("admin/adminAddDoctor", {
    user: req.user,
  })
})

router.post('/adddoc', (req, res) => {
  const {
      name,
      email,
      password,
      password2,
      salutation,
      phonenumber,
      experience,
      speciality,
      qualification,
      gender,
  } = req.body;
  const {
      imageUrl = 'https://res.cloudinary.com/nazus/image/upload/v1587475204/cakut3nckczmbtfnhmsk.png'
  } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2 || !salutation || !phonenumber || !experience || !speciality || !qualification || !gender ) {
      errors.push({
          msg: 'Please fill in all required fields'
      });
  }

  //check regNumber
  // if (answer.every(function (val) {
  //         return val != regNumber;
  //     })) {
  //     errors.push({
  //         msg: 'Invalid Registration Number'
  //     });
  //     //console.log(answer)
  // }

  //check password match
  if (password !== password2) {
      errors.push({
          msg: 'Passwords do not match'
      });
  }

  //check pass length
  if (password.length < 6) {
      errors.push({
          msg: 'Password length should be at least six characters'
      });
  }

  if (errors.length > 0) {
    console.log(req.body);
      res.render('admin/adminAddDoctor', { //suppose kunai condition meet garena bhane ni tei page ma basne bhayo
          errors, //register lai rendering garda errors lai pathairacha which is checked in messages 
          user: req.user,
          name,
          email,
          password,
          password2,
          salutation,
          phonenumber,
          experience,
          speciality,
          qualification,
          gender,   
      });
  } else {
      //validation passed
      Doctor.findOne({
              email: email
          })
          .then(doctor => {
              if (doctor) {
                  // exists
                  errors.push({
                      msg: 'Email is already registered'
                  });
                  res.render('admin/adminAddDoctor', { //if their is user re render the reg form and send error  
                      errors,
                      name,
                      email,
                      password,
                      password2,
                      salutation,
                      phonenumber,
                      experience,
                      speciality,
                      qualification,
                      gender,
                  });
              } else { //if there is new  user we have to create a user
                  const newUser = new Doctor({
                      name, // name:name,
                      email,
                      password,
                      salutation,
                      phonenumber,
                      experience,
                      speciality,
                      qualification,
                      gender,
                      imageUrl
                  });

                  // Hash password
                  bcrypt.genSalt(10, (err, salt) =>
                      bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          //set password to hash
                          newUser.password = hash;
                          //save user
                          newUser.save()
                              .then(doctor => {
                                  req.flash('success_msg', 'Successfully registered'); //calling flash msg after success
                                  res.redirect('/viewdoctors?selectedItem=VIEW DOCTORS'); //localhst ma k path handa kata jane 
                              })
                              .catch(err => console.log(err));
                      }))
              }
          });
  }

});


router.post('/deletedoctor/:id', (req, res) => {
  const doctorId = req.params.id;

  // Delete the doctor with the given ID from the database
  Doctor.findByIdAndRemove(doctorId)
    .then(deletedDoctor => {
      if (!deletedDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      req.flash('success_msg', 'Doctor deleted successfully');
      res.redirect('/viewdoctors?selectedItem=VIEW DOCTORS'); 
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

module.exports = router;
