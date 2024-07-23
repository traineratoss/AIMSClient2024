const API_URL = "http://localhost:8080/users";

async function getUserByUsername(username) {
  const response = await fetch(`${API_URL}?username=${username}`);
  const json = await response.json();
  return json;
}

async function getUserByEmail(email) {
  const response = await fetch(`${API_URL}/email?email=${email}`);
  const json = await response.json();
  return json;
}

async function checkValidationeCode(otp, usernameOrEmail) {
  
  const response = await fetch(
    `${API_URL}/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernameOrEmail: usernameOrEmail,
        otpCode: otp,
      })
  });

  if (response.ok) {
    const json = await response.json()
    localStorage.setItem("username", json.username);
    localStorage.setItem("role", json.role);
    localStorage.setItem("email", json.email);
    localStorage.setItem("fullName", json.fullName);
    localStorage.setItem("avatarId", json.avatarId - 1);
    localStorage.setItem("isFirstLogin", json.isFirstLogin);
    return json;
  } else {
    const text = await response.text();
    console.log(text)
    throw new Error(text)
  }
}

async function loginUser(username, hashPassword) {
  let connectionError = false;
  let response;
  try {
    response = await fetch(`${API_URL}/login?username=${username}`, {
      method: "POST",
      body: hashPassword,
    });
  } catch (error) {
    connectionError = true;
  }

  if (connectionError) {
    throw new Error("Server connection error");
  }

  const text = await response.text();

  if (text.message === "User was deactivated") {
    throw new Error(json.message);
  }

  if (!response.ok) {
    throw new Error("Invalid username or password");
  } else {
    localStorage.setItem("username", json.username);
    localStorage.setItem("role", json.role);
    localStorage.setItem("email", json.email);
    localStorage.setItem("fullName", json.fullName);
    localStorage.setItem("avatarId", json.avatarId - 1);
    localStorage.setItem("isFirstLogin", json.isFirstLogin);
  }
  return json;
}

async function postUser(username, email) {
  let response;
  let connectionError = false;
  try {
    response = await fetch(`${API_URL}?username=${username}&email=${email.toLowerCase()}`, {
      method: "POST",
    });
  } catch (error) {
    connectionError = true;
  }

  if (connectionError) {
    throw new Error("Server connection error");
  }

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  return json;
}

async function sendEmailToAllAdmins(username) {
  const response = await fetch(
    `${API_URL}/send-email-to-admin?username=${username}`, {
      method: "POST"
    }
  );
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
        avatarId: userUpdateDto.avatarId + 1,
      }),
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  // update local storage
  localStorage.setItem('avatarId', userUpdateDto.avatarId);
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

async function getAllUserByUsername(
  pageSize,
  pageNumber,
  sortCategory,
  username,
  currentUsername
) {
  const response = await fetch(
    `${API_URL}/allByUsername?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}&username=${username}&currentUsername=${currentUsername}`
  );
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

  if (!response.ok) {
    throw new Error('Incorrect old password');
  }

  return response;
}

async function sendNewPassword(usernameOrEmail) {
  let connectionError = false;
  try {
    const response = await fetch(`${API_URL}/send-forgot-password`, {
      method: "POST",
      body: usernameOrEmail,
    });
  } catch (error) {
    connectionError = true;
  }

  if (connectionError) {
    throw new Error("Server connection error");
  }
}

async function sendApproveEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-approve-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });

  if(!response.ok) {
    const json = await response.json();
    if(json.message === 'Approve already granted exception') {
      throw new Error('User already approved');
    } else if(json.message === 'User not found exception') {
      throw new Error('User not found');
    }
  }
}

async function sendDeclineEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-decline-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });

  if(!response.ok) {
    const json = await response.json();
    if(json.message === 'Approve already granted exception') {
      throw new Error('User already approved');
    } else if(json.message === 'User not found exception') {
      throw new Error('User not found');
    }
  }
}

async function sendActivateEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-activate-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });

  if(!response.ok) {
    const json = await response.json();
    if(json.message === 'User already activate exception') {
      throw new Error('User already activated');
    }
  }
}

async function sendDeactivateEmail(usernameOrEmail) {
  const response = await fetch(`${API_URL}/send-deactivate-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: usernameOrEmail,
  });

  if(!response.ok) {
    const json = await response.json();
    if(json.message === 'User already deactivate exception') {
      throw new Error('User already deactivated');
    }
  }
}

function getCurrentUsername() {
  return localStorage.getItem("username");
}

function getCurrentRole() {
  return localStorage.getItem("role");
}

function getCurrentEmail() {
  return localStorage.getItem("email");
}

function getCurrentFullName() {
  return localStorage.getItem("fullName");
}

function getCurrentAvatarId() {
  return localStorage.getItem("avatarId");
}

function setCurrentUsername(username) {
  localStorage.setItem('username', username);
}

function logout() {
    localStorage.clear('username');
    localStorage.clear('role');
    localStorage.clear('email');
    localStorage.clear('fullName');
    localStorage.clear('avatarId');
}

function validateUsername(username) {
  /* 
    Usernames can only have: 
    - Lowercase Letters (a-z) 
    - Numbers (0-9)
    - Dots (.)
    - Underscores (_)
  */
  const res = /^[a-zA-Z0-9_\.]+$/.exec(username);
  const valid = !!res;
  if (valid) {
    return true;
  }
  return false;
}

const sleepNow = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));


async function isFirstLogin(usernameOrEmail) {
  await sleepNow(500);
  const response = await fetch(`${API_URL}/is-first-login?usernameOrEmail=${usernameOrEmail}`);
  const json = response.json();
  return json;
}

export {
  getUserByEmail,
  getUserByUsername,
  checkValidationeCode,
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
  getCurrentEmail,
  getCurrentFullName,
  getCurrentAvatarId,
  validateUsername,
  isFirstLogin, 
  sendEmailToAllAdmins
};
