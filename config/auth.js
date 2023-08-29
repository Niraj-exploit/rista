const excludedRoutes = [
  '/patient/login',
  '/register',
 
];

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated() || excludedRoutes.includes(req.path)) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('patient/login');
  },

  ensureAuthenticated_patient: function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Patient' || excludedRoutes.includes(req.path)) {
      return next();
    }
    req.flash('error_msg', 'Access denied for patient panel');
    res.redirect('/patient/login');
  },

  ensureAuthenticated_doctor: function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Doctor' || excludedRoutes.includes(req.path)) {
      return next();
    }
    req.flash('error_msg', 'Access denied for doctor panel');
    res.redirect('/doctor/Dlogin');
  },

  ensureAuthenticated_admin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Admin' || excludedRoutes.includes(req.path)) {
      return next();
    }
    req.flash('error_msg', 'Access denied for admin panel');
    res.redirect('/admin/adminlogin');
  }
};
