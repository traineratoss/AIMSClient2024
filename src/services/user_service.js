
const API_URL = 'http://localhost:8080/users'; 

async function getUser(username){
    const response = await fetch(`${API_URL}?username=${username}`);
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

async function sendEmail(username) {
    const response = await fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: username
    });
}

export { 
    getUser, 
    postUser, 
    updateUser, 
    getAllUsers, 
    getAllUserByUsername, 
    getAllUserByIsActive, 
    sendEmail, 
    changePassword 
}



// fetch('https://dummyjson.com/products/1', {
//   method: 'PUT', /* or PATCH */
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     title: 'iPhone Galaxy +1'
//   })
// })