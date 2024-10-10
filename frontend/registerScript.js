const registerForm = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

// Function to handle registration
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        console.log('Response:', data); // Log the response

        messageDiv.textContent = data.message;

        if (response.ok) {
            // Redirect to login page after successful registration
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error during fetch:', error); // Log any fetch errors
        messageDiv.textContent = 'An error occurred. Please try again.'; // Display error message
    }
});
