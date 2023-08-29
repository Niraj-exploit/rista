// dynamic_username_options.js
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    const recipientRoleSelect = document.getElementById("recipientRole");
    console.log("Selected Role:",recipientRoleSelect);
    const recipientUsernameSelect = document.getElementById("recipientUsername");
    const optionsByRole = {
      admin:  JSON.stringify(admins.map(admin => admin.username)),
      doctor: JSON.stringify(doctors.map(doctor => doctor.username)),
      patient:  JSON.stringify(patients.map(patient => patient.username)) 
    };
  
    recipientRoleSelect.addEventListener("change", function () {
      recipientUsernameSelect.innerHTML = '<option value="" disabled selected>Select Recipient Username</option>';
      
      const selectedRole = recipientRoleSelect.value;
      
      optionsByRole[selectedRole].forEach(username => {
        const option = document.createElement("option");
        option.value = username;
        option.textContent = username;
        recipientUsernameSelect.appendChild(option);
      });
    });
  });
  