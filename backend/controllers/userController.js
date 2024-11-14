import User from '../models/userModel.js';

export const getUsernameById = async (req, res) => {
    const id = req.params.id_user;

    try {
        const username = await User.getUsernameById(id);
        if(username == null)
            return res.status(404).json({ status: 'error', message: 'User not found' });
        else if (username)
            return res.status(200).json({ status: 'success', username: username });
        // else
        //     return res.status(500).json({ status: 'error', message: username });
    } catch (error) {
        console.error("Error getting username", error);
        res.status(500).json({ status: 'error', message: 'Failed to get username' });
    }
};

export const getUserById = async (req, res) => {
    const id = req.params.id_user;

    try {
        const user = await User.getUserById(id);
        if(user == null)
            return res.status(404).json({ status: 'error', message: 'User not found' });
        else if (user){
            return res.status(200).json({ status: 'success', user});
        }
        // else
        //     return res.status(500).json({ status: 'error', message: user });
    } catch (error) {
        console.error("Error getting user", error);
        res.status(500).json({ status: 'error', message: 'Failed to get user' });
    }
};

export const updateUsername = async (req, res) => {
    const id = req.params.id_user;
    const username = req.body.new_username;

    if(!await checkUsername(username))
        return res.status(400).json({ status: 'error', message: 'Username can only contain letters and numbers and must have a maximum of 15 characters.' });

    try{
        const result = await User.updateUsername(id, username);
        if(result) {
            console.log("Username updated for user: " + id);
            return res.status(200).json({ status: 'success', message: 'Username updated' });
        }
        else
            return res.status(500).json({ status: 'error', message: 'Failed to update username' });
    } catch (error) {
        if(error.code == '23505')
            return res.status(400).json({ status: 'error', message: 'Username already taken' });
        console.error("Error updating username", error);
        res.status(500).json({ status: 'error', message: 'Failed to update username' });
    }
};

export const updateBio = async (req, res) => {
    const id = req.params.id_user;
    const bio = req.body.bio;

    try {
        var check = await checkBio(bio);
        console.log("check: "+check);
        if(check == -1)
            return res.status(400).json({ status: 'error', message: 'Bio must be less than 100 words' });   
        else if(check == -2)
            return res.status(400).json({ status: 'error', message: 'Bio must be less than 500 characters' });
    
        else if(check == 1) {
            const result = await User.updateBio(id, bio);
            if(result) {
                console.log("Bio updated for user: " + id);
                return res.status(200).json({ status: 'success', message: 'Bio updated' });
            }
            else
                return res.status(500).json({ status: 'error', message: 'Failed to update bio' });
        }
    } catch (error) {
        console.error("Error updating bio", error);
        //res.status(500).json({ status: 'error', message: 'Failed to update bio' });
    }
};

async function checkBio(bio) {
    console.log("am incercat");
    if(bio.split(' ').length > 100)
        return -1;

    if(bio.length > 500)
        return -2;
    
    return 1
}

async function checkUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(username);
}


export default {
    getUsernameById,
    getUserById,
    updateUsername,
    updateBio
}