const express = require("express");
const router = express.Router();

//call models
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const moment = require("moment");

//get method
router.get("/myAppointments", async (req, res) => {
  const appointments = await Appointment.find({
    patientID: req.user._id,
  });
  res.render("patient/myAppointments", {
    user: req.user,
    notifications: res.locals.notifications,
    appointments,
  });
});

router.get("/makeAppointment/:id", async (req, res) => {
  res.render("patient/makeAppointment", {
    user: req.user,
    notifications: res.locals.notifications,
  });
  doc_id = req.params.id;
});

router.get("/doctor/appointment", async (req, res) => {
  drid = req.user._id;
  const appointments = await Appointment.find({ doctorID: drid });
  res.render("doctor/doctorseesappointment", {
    user: req.user,
    notifications: res.locals.notifications,
    appointments,
    moment: moment,
  });
});

router.post("/makeAppointment/:id", async (req, res) => {
  const {
    appointmentDate = "To Be Confirmed",
    appointmentTime = "To Be Confirmed",
  } = req.body;

  const result = await Doctor.findOne({
    _id: doc_id,
  });
  doctorName = result.name;
  doctorSpeciality = result.speciality;
  const appointment = new Appointment({
    appointmentDate,
    appointmentTime,
  });
  appointment.patientID = req.user._id;
  appointment.patientName = req.user.name;
  appointment.doctorID = doc_id;
  appointment.doctorName = doctorName;
  appointment.doctorSpeciality = doctorSpeciality;
  await appointment.save();
  //   console.log(appointment);
  req.flash(
    "success_msg",
    "Appointment successful! We will let you know about the appointment date and time soon.Thank You!"
  );
  res.redirect("/myAppointments");
});

router.get("/cancelAppointment/:id", async (req, res) => {
  res.render("patient/cancelAppointment", {
    user: req.user,
    notifications: res.locals.notifications,
  });
  appointment_c_id = req.params.id;
});

router.post("/cancelAppointment/:id", async (req, res) => {
  const result = await Appointment.findByIdAndDelete({
    _id: appointment_c_id,
  });
  result.deleteOne();
  req.flash("success_msg", "Appointment was cancelled successfully!!");
  res.redirect("patient/myAppointments");
});

//Admin sees appointment

router.get("/seeAppointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.render("admin/seeAppointments", {
    user: req.user,
    notifications: res.locals.notifications,
    appointments,
    moment: moment,
  });
});

//Admin Update Appoitment (get update page)
router.get("/updateAppointment/:id", async (req, res) => {
  res.render("admin/updateAppointment", {
    user: req.user,
    notifications: res.locals.notifications,
  });
  appointment_id = req.params.id;
});

//Admin update appointment (post)
router.post("/updateAppointment/:id", async (req, res) => {
  const result = await Appointment.findByIdAndUpdate({
    _id: appointment_id,
  });
  result.appointmentDate = req.body.appointmentDate;
  result.appointmentTime = req.body.appointmentTime;
  await result.save();
  //   console.log(appointment);
  req.flash("success_msg", "Apppointment was updated successfully");
  res.redirect("/seeAppointments");
});

//Delete appointment

router.post("/deleteAppointment/:appo_id", async (req, res) => {
  appointment_d_id = req.params.appo_id;
  await Appointment.findOneAndDelete(
    {
      _id: appointment_d_id,
    },
    (err, appointment) => {
      if (err) {
        req.flash("error_msg", "There was an error deleting the appointment");
        res.redirect("/seeApppointments");
      } else {
        req.flash("success_msg", "Apppointment was deleted successfully");
        res.redirect("/seeAppointments");
      }
    }
  );
});


router.post("/deleteAppointmentD/:appo_id", async (req, res) => {
  const appointment_d_id = req.params.appo_id;

  try {
    const appointment = await Appointment.findOne({ _id: appointment_d_id });

    if (!appointment) {
      req.flash("error_msg", "Appointment not found");
      return res.redirect("/doctor/appointment");
    }

    if (appointment.appointmentDate === "To Be Confirmed") {
      req.flash("error_msg", "You can't delete this appointment");
      return res.redirect("/doctor/appointment");
    }

    await Appointment.findOneAndDelete({ _id: appointment_d_id });
    req.flash("success_msg", "Appointment was deleted successfully");
    res.redirect("/doctor/appointment");
  } catch (err) {
    req.flash("error_msg", "There was an error deleting the appointment");
    res.redirect("/doctor/appointment");
  }
});


module.exports = router;

