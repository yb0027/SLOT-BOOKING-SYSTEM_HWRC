const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse JSON bodies

mongoose.connect('mongodb://127.0.0.1:27017/userinfo');
const db = mongoose.connection;
db.once('open', () => {
    console.log("Mongoose connection successful");
});


const userSchema = new mongoose.Schema({
    username: String,
    contact: { type: String, unique: true },
    email: String,
    password: String,
    repeatpassword: String,
});

const Users = mongoose.model("data", userSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'data' },
    hwrc: String,
    slotDate: String,
    slotTime: String,
});


const Bookings = mongoose.model('booking', bookingSchema);

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Routes for registration
app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
});

// Routes for login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/post', async (req, res) => {
    const { username, contact, email, password, repeatpassword } = req.body;

    // Check if user with the given contact already exists
    const existingUser = await Users.findOne({ contact });
    if (existingUser) {
        return res.status(400).json({ message: 'This contact number is already registered' });
    }

    // Create and save the new user
    const user = new Users({
        username,
        contact,
        email,
        password,
        repeatpassword,
    });
    await user.save();
    console.log(user);
    res.status(200).json({ message: 'User data saved successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if user with the given username exists
    const existingUser = await Users.findOne({ username });

    if (!existingUser) {
        return res.status(400).json({ message: 'Either Username or Password is incorrect' });
    }

    // Check if the password matches
    if (existingUser.password !== password) {
        return res.status(400).json({ message: 'Either Username or Password is incorrect' });
    }

    // If both username and password are correct, return success message
    res.status(200).json({ message: 'Login successful' });
});

// Route for booking a slot
app.post('/bookSlot', async (req, res) => {
    const { hwrc, slotDate, slotTime, userId } = req.body;

    // Count existing bookings for the given slotDate and slotTime
    const countBookings = await Bookings.countDocuments({ slotDate, slotTime });

    // Check if the count is less than 5 to allow booking
    if (countBookings < 5) {
        // Create and save the new booking
        const booking = new Bookings({
            userId,
            hwrc,
            slotDate,
            slotTime,
        });

        try {
            await booking.save();
            console.log(booking);
            res.status(200).json({ status: 'success', message: 'Booking successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Error saving booking' });
        }
    } else {
        // If slot is full, return a message
        res.status(400).json({ status: 'fail', message: 'Slot is full for this time. Please choose another time slot.' });
    }
});

// Route to update profile
app.post('/submit-profile', async (req, res) => {
    const { currentUsername, currentPassword, newPassword } = req.body;

    try {
        // Find the user by current username and password
        const user = await Users.findOne({ username: currentUsername, password: currentPassword });

        // If user not found, return error
        if (!user) {
            return res.status(400).json({ message: 'Current username or password is incorrect' });
        }

        // Update the user's password
        user.password = newPassword;
        user.repeatpassword = newPassword; // Assuming repeatpassword should also be updated

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
