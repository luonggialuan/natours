import '@babel/polyfill';
import { login, logout, signup } from './login';
import { displayMap } from './mapbox';
import { updateCurrentUser } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserDataForm = document.querySelector('.form-user-data');
const updateUserPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    // console.log(locations);
    displayMap(locations);
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        signup(name, email, password, confirmPassword);
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (updateUserDataForm) {
    updateUserDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        updateCurrentUser(form, 'data');
    });
}

if (updateUserPasswordForm) {
    updateUserPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('new-password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateCurrentUser({ passwordCurrent, password, passwordConfirm }, 'password');

        document.querySelector('.btn--save-password').textContent = 'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}
