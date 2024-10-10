const authForm = document.getElementById('authForm');
const messageDiv = document.getElementById('message');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeMessage = document.getElementById('welcomeMessage'); 
const updateForm = document.getElementById('updateForm');
const token = localStorage.getItem('token'); 

authForm?.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://user-management-kappa-one.vercel.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Response:', data); 

        messageDiv.textContent = data.message;

        if (response.ok) {
            localStorage.setItem('token', data.token); 
            localStorage.setItem('username', data.username); 
            window.location.href = 'profile.html'; 
        }
    } catch (error) {
        console.error('Error during fetch:', error); 
        messageDiv.textContent = 'An error occurred. Please try again.'; 
    }
});

updateForm?.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('updateEmail').value; 
    const password = document.getElementById('updatePassword').value;

    try {
        const response = await fetch('https://user-management-kappa-one.vercel.app/api/auth/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Update Response:', data); 

        messageDiv.textContent = data.message; 

        if (response.ok) {
            updateForm.reset();
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        messageDiv.textContent = 'An error occurred while updating. Please try again.'; 
    }
});

logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    window.location.href = 'index.html'; 
});

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username && welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${username}!`;
    }
});
