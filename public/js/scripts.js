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
    let isValid = validateForm();

    if (isValid) {
      // If all checks pass, submit the form programmatically
      this.submit();
    }
  });

  function validateForm() {
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
  
});
