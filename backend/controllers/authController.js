import User from '../models/userModel.js';


export const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findByEmail(email);

    if(user && user.password === password){
        req.session.userId = user.id;
        return res.redirect('/');
    } else {
        return res.status(401).send('Invalid email or password');
    }
};

export default {
    login, 
};