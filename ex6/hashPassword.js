const bcrypt = require('bcrypt');

// Replace 'your_password_here' with the password you want to hash
const password = 'aadhi292004';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log("Hashed password:", hash); // Copy this hash
});
