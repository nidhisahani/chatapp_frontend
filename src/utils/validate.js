// Validate.js

// Validate Sign-In Form
export const checkValidSignInForm = (email, password) => {
    const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^((0-9)|(a-z)|(A-Z)|\s)]).{8,}$/.test(password);

    if (!isEmailValid) return "Invalid email format";
    if (!isPasswordValid) return "Invalid password";
    return null;
};

// Validate Sign-Up Form
export const checkValidSignUpForm = (username, phone, email, password) => {
    const isUsernameValid = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/.test(username);
    const isPhoneValid = /^\d{10}$/.test(phone); // Assumes phone is a 10-digit number
    const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

    if (!isUsernameValid) return "Invalid username format";
    if (!isPhoneValid) return "Phone number must be 10 digits";
    if (!isEmailValid) return "Invalid email format";

    // Password validation
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password)) return "Password must contain at least 1 lowercase letter";
    if (!/[A-Z]/.test(password)) return "Password must contain at least 1 uppercase letter";
    if (!/\d/.test(password)) return "Password must contain at least 1 number";
    if (!/[^((0-9)|(a-z)|(A-Z)|\s)]/.test(password)) return "Password must contain at least 1 special character";

    return null;
};

// Validate Forgot Password Form
export const checkValidForgotForm = (email) => {
    const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

    if (!isEmailValid) return "Invalid email format";
    return null;
};