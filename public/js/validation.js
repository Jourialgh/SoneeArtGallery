
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('orderForm').addEventListener('submit', function(event) {
        var customerName = document.getElementById('customerName').value.trim();
        var customerEmail = document.getElementById('customerEmail').value.trim();
        var errorMessages = [];

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

        if (errorMessages.length > 0) {
            event.preventDefault();
            alert(errorMessages.join("\n"));
        }
        // If no errors, form will submit
    });
});
