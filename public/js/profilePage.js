import "./header.js";

let currentUserId = null;

var username = null;
var alreadyHadBio = false;
var actualBio = null;

const url = window.location.href;
const userId = url.split("/").pop();

const bioActionsContainer = document.getElementById('admin-bio-actions-container');
const adminActionContainer = document.getElementById('profile-admin-actions-container');
const changeUsernameContainer = document.getElementById('change-username-container');
const changePasswordContainer  = document.getElementById('change-password-container');
const seePostsButton = document.getElementById('user-posts-button');
const bioTextArea = document.getElementById('bio');
const bioCancelButton = document.getElementById('cancel-bio-changes');
const bioSaveButton = document.getElementById('save-bio-changes');
const changeUsernameButton = document.getElementById('change-username-button');
const newUsernameForm = document.getElementById('new-username-form');
const saveUsernameChangesButton = document.getElementById('save-username-changes'); 
const cancelUsernameChangesButton = document.getElementById('cancel-username-changes');
const changePasswordButton = document.getElementById('change-password-button');
const actualPasswordForm = document.getElementById('actual-password-form');
const newPasswordForm = document.getElementById('new-password-form');
const confirmPasswordForm = document.getElementById('confirm-password-form');
const savePasswordChangesButton = document.getElementById('save-password-changes');
const cancelPasswordChangesButton = document.getElementById('cancel-password-changes');

document.addEventListener('DOMContentLoaded', async () => {
    try{
        const response = await fetch('/api/v1/auth/session');
        if(response.ok) {
            const sessionData = await response.json();
            currentUserId = sessionData.userId;
            if(sessionData.userId == userId) {
                await requestProfileData(true);
                await showAccountAdmin();
            } else
                requestProfileData(false);

        }
        else {
            console.error('Failed to fetch session');
            return;
        }
    } catch(error) {
        console.error('Failed to fetch session', error);
    }

});

async function requestProfileData(isCurrentUser) {
    try {
        const response = await fetch(`/api/v1/users/getUserById/${userId}`);
        if (response.ok) {
            const userData = await response.json();
            displayProfileData(userData.user, isCurrentUser);
        } else {
            console.error('Failed to fetch profile data');
        }
    } catch (error) {
        console.error('Failed to fetch profile data', error);
    }
}


function displayProfileData(userData, isCurrentUser) {
    username = userData.username;
    if(isCurrentUser){
        const email = userData.email;
        const emailElement = document.getElementById('email');
        emailElement.innerText = email;
    }
    const bio = userData.bio;

    const usernameElement = document.getElementById('username');
    const bioElement = document.getElementById('bio');

    usernameElement.innerText = username;
    if(bio != null) {
        bioElement.innerText = bio;
        actualBio = bio;
        alreadyHadBio = true;
    }
    else
        bioElement.placeholder = "No bio available";

    if(isCurrentUser) {
        bioElement.addEventListener('focusin', async () => {
            toggleBioEditMode(true);
        });
        bioElement.addEventListener('focusout', async () => {
            toggleBioEditMode(false);
        });
    } else 
        bioElement.readOnly = true;
}

async function showAccountAdmin() {
    const emailElement = document.getElementById('email');
    emailElement.classList.remove('invisible');
    adminActionContainer.classList.remove('invisible');
    seePostsButton.classList.add('invisible');
}

async function toggleBioEditMode(toggleTo) {
    if(toggleTo) {
        bioActionsContainer.classList.remove('invisible');
    } else if(!toggleTo && bioTextArea.value == "") {
        bioActionsContainer.classList.add('invisible');
    }

}

async function updateBio(newBio) {
    const bioElement = document.getElementById('bio');
    try {
        const response = await fetch(`/api/v1/users/updateBio/${currentUserId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bio: newBio }),
        });
        const userData = await response.json();
        if (response.ok && userData.status == 'success') {
            bioElement.innerText = newBio;
            bioElement.placeholder = "";
            window.location.reload();
        } else if(userData.status == 'error') {
            alert('Failed to update bio: ' + userData.message);
            return;
        }
    } catch (error) {
        return;
    }
}

seePostsButton.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("userId: " + userId);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    window.location.href = `/home`;
});


bioCancelButton.addEventListener('click', async () => {
    if(!alreadyHadBio)
        bioTextArea.value = "";
    else
        bioTextArea.value = actualBio;

    bioActionsContainer.classList.add('invisible');
});

bioSaveButton.addEventListener('click', async () => {
    const newBio = bioTextArea.value;
    if(newBio != "" && newBio != null && newBio != actualBio) {
        await updateBio(newBio);
    } else if(newBio == actualBio) {
        bioActionsContainer.classList.add('invisible');
    }
});

changeUsernameButton.addEventListener('click', async () => {
    changeUsernameContainer.classList.remove('invisible');
    adminActionContainer.classList.add('invisible');
    newUsernameForm.value = username;
});

saveUsernameChangesButton.addEventListener('click', async () => {
    requestUsernameChange();
});

cancelUsernameChangesButton.addEventListener('click', async () => {
    changeUsernameContainer.classList.add('invisible');
    adminActionContainer.classList.remove('invisible');
    if(newUsernameForm.classList.contains('is-invalid'))
        newUsernameForm.classList.remove('is-invalid');
});

changePasswordButton.addEventListener('click', async () => {
    changePasswordContainer.classList.remove('invisible');
    adminActionContainer.classList.add('invisible');
});

savePasswordChangesButton.addEventListener('click', async () => {
    requestPasswordChange();
});

cancelPasswordChangesButton.addEventListener('click', async () => {
    changePasswordContainer.classList.add('invisible');
    adminActionContainer.classList.remove('invisible');
    if(actualPasswordForm.classList.contains('is-invalid'))
        actualPasswordForm.classList.remove('is-invalid');
    if(newPasswordForm.classList.contains('is-invalid'))
        newPasswordForm.classList.remove('is-invalid');
    if(confirmPasswordForm.classList.contains('is-invalid'))
        confirmPasswordForm.classList.remove('is-invalid');

    actualPasswordForm.value = "";
    newPasswordForm.value = "";
    confirmPasswordForm.value = "";
});

async function requestUsernameChange() {
    const newUsername = newUsernameForm.value;
    
    if(newUsername == username) {
        cancelUsernameChangesButton.click();
        return;
    }

    if(newUsername == "" || newUsername == null) {
        alert('Username cannot be empty');
        newUsernameForm.classList.add('is-invalid');
        return;
    }

    try {
        const response = await fetch('/api/v1/users/updateUsername/' + currentUserId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ new_username: newUsername }),
        });
        
        const userData = await response.json();
        if (response.ok && userData.status == 'success') {
            window.location.reload();
        } else if(userData.status == 'error') {
            alert('Failed to update username: ' + userData.message);
            newUsernameForm.classList.add('is-invalid');
            return;
        }
    } catch (error) {
        console.error('Failed to update username', error);
        return;
    }
}

async function requestPasswordChange() {
    const actualPassword = actualPasswordForm.value;
    const newPassword = newPasswordForm.value;
    const confirmPassword = confirmPasswordForm.value;

    if(actualPassword == ""){
        alert('Please provide the current password.');
        actualPasswordForm.classList.add('is-invalid');
        return;
    }
    if(newPassword == ""){
        alert('Please provide the new password.');
        newPasswordForm.classList.add('is-invalid');
        return;
    }
    if(actualPassword == newPassword){
        alert('The new password must be different from the current password.');
        actualPasswordForm.classList.add('is-invalid');
        newPasswordForm.classList.add('is-invalid');
        return;
    }
    if(newPassword != confirmPassword){
        alert('The new password and the confirmation password must match.');
        newPasswordForm.classList.add('is-invalid');
        confirmPasswordForm.classList.add('is-invalid');
        return;
    }

    try{
        const response = await fetch('/api/v1/auth/updatePassword', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ actual_password: actualPassword, new_password: newPassword, user_id: currentUserId }),
        });

        const userData = await response.json();
        if (response.ok && userData.status == 'success') {
            alert('Password updated successfully');
            cancelPasswordChangesButton.click();
            return;
        } else if(userData.status == 'error') {
            alert('Failed to update password: ' + userData.message);
            newPasswordForm.classList.add('is-invalid');
            return;
        }
    } catch(error){
        console.error('Failed to update password', error);
        return;
    }
}
