import User from '../models/userModel.js';
import bcrypt from 'bcrypt';


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Use bcrypt.compare to check the plain password against the hashed password in the DB
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.userId = user.id;
            return res.status(200).send('Login successful');
        } else {
            return res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Server error');
    }
};


export const logout = (req, res) => {
    // Destroy the session and redirect the user
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.clearCookie('connect.sid'); // Assuming you're using connect.sid as the session cookie
        res.status(200).send('Logout successful');
    });
};


export const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'All fields are required', field: 'all' });
    }

    if (!checkPasswordSyntax(password)) {
        return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters long and contain at least one upper case character, one number and one special character', field: 'password' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Passwords do not match', field: 'passwords' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await User.register(username, email, hashedPassword);

        if (response && typeof response === 'number') {
            req.session.userId = response;
            console.log("ce tare baaa");
            return res.status(201).json({ status: 'success', message: 'User created'});
        } else if (response === 'email') {
            return res.status(400).json({ status: 'error', message: 'Email already in use', field: 'email' });
        } else if (response === 'username') {
            return res.status(400).json({ status: 'error', message: 'Username already in use', field: 'username' });
        } else {
            return res.status(500).json({ status: 'error', message: 'Failed to create user', });
        }
    } catch (error) {
        console.error('Error in registration process:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};


export const getMyCurrentSession = (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({message: 'Unauthorized'});
    }
    res.json({userId: req.session.userId});
};

function checkPasswordSyntax(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return passwordRegex.test(password);
}

export default {
    login, 
    register,
    logout,
    getMyCurrentSession,
    
};