const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).json(error);
    }
};