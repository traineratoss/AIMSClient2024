const API_URL = "http://localhost:8080/users";

async function getUserByUsername(username) {
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
    method: "POST",
    body: hashPassword,
  });

  const json = await response.json();
  if(!response.ok) {
    throw new Error(json.message);
  } else {
    sessionStorage.setItem('username', json.username);
    sessionStorage.setItem('role', json.role);
  }
  return json;
}

async function postUser(username, email) {
  const response = await fetch(
    `${API_URL}?username=${username}&email=${email}`,
    {
      method: "POST",
    }
  );
  
  const json = await response.json();
  if(!response.ok) {
    throw new Error(json.message);
  }
  return json;
}

async function updateUser(username, userUpdateDto) {
  const response = await fetch(
    `${API_URL}/update-profile?username=${username}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userUpdateDto.username,
        fullName: userUpdateDto.fullName,
        email: userUpdateDto.email,
        avatarId: userUpdateDto.avatarId,
      }),
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  return json;
}

async function updateUserRole(username) {
  const response = await fetch(`${API_URL}/update-role?username=${username}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  return json;
}

async function getAllUsersForAdmin(pageSize, pageNumber, sortCategory) {
  const response = await fetch(
    `${API_URL}/allUsers?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`
  );
  const json = await response.json();
  return json;
}

async function getAllUserByIsActive(
  isActive,
  pageSize,
  pageNumber,
  sortCategory
) {
  const response = await fetch(
    `${API_URL}/allByIsActive?isActive=${isActive}&pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`
  );
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
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: changePasswordDTO.username,
      oldPassword: changePasswordDTO.oldPassword,
      newPassword: changePasswordDTO.newPassword,
    }),
  });
  return response;
}

async function sendNewPassword(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-forgot-password`, {
    method: "POST",
    body: usernameOrEmail,
  });
  const json = await response.json();
  return json;
}

async function sendApproveEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-approve-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });
}

async function sendDeclineEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-decline-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });
}

async function sendActivateEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-activate-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });
}

async function sendDeactivateEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-deactivate-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });
}

function getCurrentUsername() {
    return sessionStorage.getItem('username');
}

function getCurrentRole() {
  return sessionStorage.getItem('role');
}

function logout() {
    sessionStorage.clear('username');
    sessionStorage.clear('role');
}

export {
  getUserByEmail,
  getUserByUsername,
  postUser,
  updateUser,
  updateUserRole,
  getAllUsersForAdmin,
  getAllUserByUsername,
  getAllUserByIsActive,
  sendApproveEmail,
  changePassword,
  loginUser,
  getCurrentUsername,
  sendNewPassword,
  sendDeclineEmail,
  sendActivateEmail,
  sendDeactivateEmail,
  logout,
  getCurrentRole,
};
