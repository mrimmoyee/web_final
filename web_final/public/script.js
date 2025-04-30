const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUpButton');
    const signInButton = document.getElementById('signInButton');
    const signInForm = document.getElementById('signIn');
    const signUpForm = document.getElementById('signup');

    signUpForm.style.display = 'none';

    signUpButton.addEventListener('click', () => {
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
    });

    signInButton.addEventListener('click', () => {
        signUpForm.style.display = 'none';
        signInForm.style.display = 'block';
    });

    const googleLoginButtons = document.querySelectorAll('.google-login');
    googleLoginButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Google Login functionality requires Google OAuth setup with your Client ID.');
        });
    });
});