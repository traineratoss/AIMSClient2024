const API_URL = 'http://localhost:8080/users'; 

async function getUserByUsername(username){
    const response = await fetch(`${API_URL}/username?username=${username}`);
    const json = await response.json();
    return json;
}

async function getUserByEmail(email) {
    const response = await fetch(`${API_URL}/email?email=${email}`);
    const json = await response.json();
    return json;
}

async function loginUser(username, hashPassword) {
    const response = await fetch(`${API_URL}/login?username=${username}`, {
        method: 'POST',
        body: hashPassword
    });
    const json = await response.json();
    return json;
}

async function postUser(username, email){
    const response = await fetch(`${API_URL}?username=${username}&email=${email}`, {
        method: 'POST'
    });
    const json = await response.json();
    return json;
}

async function updateUser(username, userUpdateDto) {
    const response = await fetch(`${API_URL}?username=${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "isActive": userUpdateDto.isActive,
            "role": userUpdateDto.role,
            "username": userUpdateDto.username,
            "fullName": userUpdateDto.fullName,
            "email": userUpdateDto.email,
            "avatar": userUpdateDto.avatarId
        })
    });
    const json = await response.json();
    return json;
}

async function getAllUsers(pageSize, pageNumber, sortCategory) {
    const response = await fetch(`${API_URL}/all?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`);
    const json = await response.json();
    return json;
}

async function getAllUserByIsActive(isActive, pageSize, pageNumber, sortCategory) {
    const response = await fetch(`${API_URL}/allByIsActive?isActive=${isActive}&pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`);
    const json = await response.json();
    return json;
}

async function getAllUserByUsername(username) {
    const response = await fetch(`${API_URL}/allByUsername?username=${username}`);
    const json = await response.json();
    return json;
}

async function changePassword(changePasswordDTO) {
    const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "username": changePasswordDTO.username,
            "oldPassword": changePasswordDTO.oldPassword,
            "newPassword": changePasswordDTO.newPassword,
        })
    });
    return response;
}

async function sendNewPassword(usernameOrEmail) {
    const response = await fetch(`${API_URL}/send-forgot-password`, {
        method: 'POST',
        body: usernameOrEmail
    });
    const json = await response.json();
    return json;
}

async function sendApproveEmail(usernameOrEmail) {
    const response = await fetch(`${API_URL}/send-approve-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: usernameOrEmail
    });
}

async function sendDeclineEmail(usernameOrEmail) {
    const response = await fetch(`${API_URL}/send-decline-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: usernameOrEmail
    });
}

async function sendActivateEmail(usernameOrEmail) {
    const response = await fetch(`${API_URL}/send-activate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: usernameOrEmail
    });
}

async function sendDeactivateEmail(usernameOrEmail) {
    const response = await fetch(`${API_URL}/send-deactivate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: usernameOrEmail
    });
}
 
// @TODO : Add a function to store that into local storage when login in

function getCurrentUser(){
    return JSON.parse(localStorage.getItem('user'))
}

function setCurrentUser(username){
    const currenUser = getUser(username)
    localStorage.setItem('user', JSON.stringify(currenUser));
}

export { 
    getUserByEmail,
    getUserByUsername, 
    postUser, 
    updateUser, 
    getAllUsers, 
    getAllUserByUsername, 
    getAllUserByIsActive, 
    sendApproveEmail, 
    changePassword,
    loginUser,
    getCurrentUser,
    setCurrentUser,
    sendNewPassword,
    sendDeclineEmail,
    sendActivateEmail,
    sendDeactivateEmail
}