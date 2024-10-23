$(document).ready(function () {

  console.log("wtfbroRF");
  if (idCurrentUser == 0) {
    $(".user-action").addClass("disabled");
    $(".user-action").removeClass("active");
    $(".log-button").text("Log In");
    $(".log-button").attr("href", "/login");
  } else {
    $(".user-action").removeClass("disabled");
    $(".user-action").addClass("active");
    $(".log-button").text("Log Out");
  }

  $("#registerForm").on("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Validate form fields
    let isValid = validateRegisterForm();

    if (isValid) {
      // If all checks pass, submit the form programmatically
      this.submit();
    }
  });

  $("#loginForm").on("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    console.log("plm");
    // Validate form fields
    let isValid = validateLoginForm();

    if (isValid) {
      // If all checks pass, submit the form programmatically
      this.submit();
    }
  });

  function validateLoginForm() {
    let email = $(".email-input").val();
    let password = $(".password-input").val();
    console.log("uite:" + email);

    // Check if email is empty or invalid format
    if (email === "") {
      alert("Please enter an email address");
      return false;
    } 

    // Check if password is empty
    if (password === "") {
      alert("Please enter a password");
      return false;
    }

    // If everything is valid
    return true;
  }

  function validateRegisterForm() {
    let username = $(".username-input").val().trim();
    let email = $(".email-input").val().trim();
    let password = $(".password-input").val();
    let confirmPassword = $(".confirm-password-input").val();

    // Check if username is empty
    if (username === "") {
      alert("Please enter a username");
      return false;
    }

    // Check if email is empty or invalid format
    if (email === "") {
      alert("Please enter an email address");
      return false;
    } else if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    // Check if password is empty
    if (password === "") {
      alert("Please enter a password");
      return false;
    }

    if(!validatePasswordLength(password)){
      alert("Password must be at least 8 characters long");
      return false;
    }

    if(!validatePassword(password)){
      alert("Password must contain at least one uppercase, one numer and one special character");
      return false;
    }


    // Check if confirm password is empty
    if (confirmPassword === "") {
      alert("Please confirm your password");
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    // If everything is valid
    return true;
  }

  // Email validation function using regex
  function validateEmail(email) {
    // Simple regex to check basic email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function validatePasswordLength(password) {
    return password.length >= 8;
  }

  function validatePassword(password) {
    //check if it has one uppercase, one number and one special character
    const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return passwordPattern.test(password);
  }
  
});
