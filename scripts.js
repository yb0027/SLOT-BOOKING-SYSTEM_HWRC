// JavaScript to handle redirection to login and registration pages
document.addEventListener('DOMContentLoaded', function() {
    // Get the login button
    var loginButton = document.querySelector('.login-button');
    
    // Add click event listener to the login button
    loginButton.addEventListener('click', function() {
        // Redirect to the login page
        window.location.href = 'login.html';
    });
    
    // Get the registration button
    var registerButton = document.querySelector('.register-button');
    
    // Add click event listener to the registration button
    registerButton.addEventListener('click', function() {
        // Redirect to the registration page
        window.location.href = 'registration.html';
    });
});

function toggleBookingForm() {
    var bookingForm = document.getElementById('bookingForm');
    bookingForm.classList.toggle('show');
}
// Function to handle form submission
function handleBooking(event) {
    event.preventDefault(); // Prevent form submission (since there's no backend)
    // You can implement logic here to handle the booking (e.g., display confirmation message)
    alert('Your booking has been confirmed!'); // For demonstration purposes
}

function toggleSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'non';
            });

            // Show the selected section
            document.getElementById(sectionId).style.display = 'block';
        }
