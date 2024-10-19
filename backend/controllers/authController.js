import User from '../models/userModel.js';


export const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findByEmail(email);

    if(user && user.password === password){
        req.session.userId = user.id;
        return res.status(200).send('Login successful');
    } else {
        return res.status(401).send('Invalid email or password');
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
    const {username, email, password} = req.body;

    const user = await User.register(username, email, password);

    if(user && typeof user === 'number'){
        req.session.userId = user;
        return res.status(201).send('User created');
    } 
    else if(user === "email"){ 
        return res.status(400).send('Email already in use');
    } 
    else if(user === "username"){
        return res.status(401).send('Username already in use');
    } 
    else {
        return res.status(500).send('Failed to create user');
    }
};

export const getMyCurrentSession = (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({message: 'Unauthorized'});
    }
    res.json({userId: req.session.userId});
};

export default {
    login, 
    register,
    logout,
    getMyCurrentSession,
    
};