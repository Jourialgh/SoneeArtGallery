
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('orderForm').addEventListener('submit', function(event) {
        var customerName = document.getElementById('customerName').value.trim();
        var customerEmail = document.getElementById('customerEmail').value.trim();
        var errorMessages = [];

        // Frontend JavaScript Validation
        var fname = document.getElementById('fname').value;
        var lname = document.getElementById('lname').value;
        var mobile = document.getElementById('mobile').value;
        var email = document.getElementById('email').value;
        var dob = document.getElementById('dob').value;

        var namePattern = /^[A-Za-z]+$/;
        var mobilePattern = /^[0-9]{10}$/;

        if (customerName.length < 3 || customerName.length > 20) {
            errorMessages.push("Name should be between 3 and 20 characters long.");
        }

        if (!customerEmail) {
            errorMessages.push("Email is required.");
        } else {
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(customerEmail)) {
                errorMessages.push("Please enter a valid email address.");
            }
        }

        if (!namePattern.test(fname)) {
            errorMessages.push("Please enter a valid first name.");
        }

        if (!namePattern.test(lname)) {
            errorMessages.push("Please enter a valid last name.");
        }

        if (!mobilePattern.test(mobile)) {
            errorMessages.push("Please enter a valid 10-digit mobile number.");
        }

        // Additional validation checks can be added as needed

        if (errorMessages.length > 0) {
            event.preventDefault();
            alert(errorMessages.join("\n"));
        }
        // If no errors, form will submit
    });
});

