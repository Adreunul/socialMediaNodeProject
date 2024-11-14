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
            console.log('User logged in:', user.id);
            return res.status(200).json({ userId: user.id, message: 'Login successful' });
        } else {
            return res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json('Server error');
    }
};


export const logout = (req, res) => {
    // Destroy the session and redirect the user
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.clearCookie('connect.sid');
        res.status(200).send('Logout successful');
    });
};


export const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'All fields are required', field: 'all' });
    }

    if (!checkUsername(username) || username.length > 15) {
        return res.status(400).json({ status: 'error', message: 'Username can only contain letters and numbers and must have a maximum of 15 characters.', field: 'username' });
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
            console.log('User registered:', response);
            return res.status(201).json({ status: 'success', message: 'User created', userId: response });
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

export const updatePassword = async (req, res) => {
    const { actual_password, new_password, user_id } = req.body;

    try{
        const user = await User.findById(user_id);
        const passwordMatch = await bcrypt.compare(actual_password, user.password);

        if(!passwordMatch){
            return res.status(401).json({status: 'error', message: 'Actual password is incorrect.'});
        }
    } catch(error){
        console.error('Error updating password:', error);
        return res.status(500).json({status: 'error', message: 'Server error'});
    }

    if(!await checkPasswordSyntax(new_password)){
        return res.status(400).json({status: 'error', message: 'Password must be at least 8 characters long and contain at least one upper case character, one number and one special character'});
    }
    try{
        const hashedNewPassword = await bcrypt.hash(new_password, 10);
        const response = await User.updatePassword(user_id, hashedNewPassword);
        if(response){
            console.log('Password updated for user:', user_id);
            return res.status(200).json({status: 'success', message: 'Password updated'});
        }
        else{
            return res.status(500).json({status: 'error', message: 'Failed to update password'});
        }
    } catch (error){
        console.error('Error updating password:', error);
        return res.status(500).json({status: 'error', message: 'Server error'});
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

function checkUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
}

export default {
    login, 
    register,
    updatePassword,
    logout,
    getMyCurrentSession,
    
};