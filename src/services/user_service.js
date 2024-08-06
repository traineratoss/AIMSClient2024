import { invalidateTokens, setTokenExpiry } from "./token.service";
import router from "../router";
import { nativeFetch } from "../main";

const API_URL = "http://localhost:8080/users";

async function getUserByUsername(username) {
  const response = await fetch(`${API_URL}?username=${username}`,{
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
  });
  const json = await response.json();
  return json;
}

async function getUserByEmail(email) {
  const response = await fetch(`${API_URL}/email?email=${email}`,{
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
});
  const json = await response.json();
  return json;
}

async function checkValidationeCode(otp, usernameOrEmail) {
  
  const response = await fetch(
    `${API_URL}/verify-otp`,
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernameOrEmail: usernameOrEmail,
        otpCode: otp,
      })
  });

  if (response.ok) {
    const json = await response.json()
    sessionStorage.setItem("username", json.username);
    sessionStorage.setItem("role", json.role);
    sessionStorage.setItem("email", json.email);
    sessionStorage.setItem("fullName", json.fullName);
    sessionStorage.setItem("avatarId", json.avatarId - 1);
    sessionStorage.setItem("isFirstLogin", json.isFirstLogin);
    sessionStorage.setItem("userId", json.id);
    return json;
  } else {
    const text = await response.text();
    throw new Error(text)
  }
}


async function loginUser(username, password) {
  let connectionError = false;
  let response;

  function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }

  sessionStorage.setItem("Session-ID", uuidv4())

  try {
    response = await nativeFetch(`http://localhost:8080/api/v1/auth/login`, {
      method: "POST",
      cache: "no-cache",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Session-ID": sessionStorage.getItem("Session-ID")
      },
      body: JSON.stringify({
        usernameOrEmail: username,
        password: password
      })
    });
  } catch (error) {
    connectionError = true;
  }
 
  if (connectionError) {
    throw new Error("Server connection error");
  }
 
  if (!response.ok) {
    const text = await response.text();
    if (text.message === "User was deactivated") {
      throw new Error(json.message);
    }
    throw new Error("Invalid username or password");
  } else {
    const json = await response.json();
    const userData = json.userData;
    sessionStorage.setItem("username", userData.username);
    sessionStorage.setItem("role", userData.role);
    sessionStorage.setItem("email", userData.email);
    sessionStorage.setItem("fullName", userData.fullName);
    sessionStorage.setItem("avatarId", userData.avatarId - 1);
    sessionStorage.setItem("isFirstLogin", userData.isFirstLogin);
    sessionStorage.setItem("userId", userData.id);

    setTokenExpiry(json.accessTokenExpiryDate, json.refreshTokenExpiryDate);

    return json;
  }
}

async function postUser(username, email) {
  let response;
  let connectionError = false;
  try {
    response = await nativeFetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        email: email
      })
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

async function updateUser(username, userUpdateDto) {  

  const response = await fetch(
    `${API_URL}/update-profile?username=${username}`,
    {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
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
  sessionStorage.setItem('avatarId', userUpdateDto.avatarId);
  return json;
}

async function updateUserRole(username) {
  const response = await fetch(`${API_URL}/update-role?username=${username}`, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
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
    `${API_URL}/allUsers?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`,{
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
    }
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
    `${API_URL}/allByIsActive?isActive=${isActive}&pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`,{
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
    }
  );
  const json = await response.json();
  return json;
}

async function getAllUserByUsername(
  pageSize,
  pageNumber,
  sortCategory,
  username,
  currentUsername,
) {
  const response = await fetch(
    `${API_URL}/allByUsername?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}&username=${username}&currentUsername=${currentUsername}`,{
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
    }
  );
  const json = await response.json();
  return json;
}


async function changePassword(changePasswordDTO) {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: changePasswordDTO.username,
      newPassword: changePasswordDTO.newPassword,
      oldPassword: changePasswordDTO.oldPassword
    }),
    
  });
   const json = await response.json();
  if(json.message === 'The old password is incorrect!') {
      throw new Error('The old password is incorrect!');
  }
  if(json.message === 'The new password cannot be the same as the old password!') {
    throw new Error('The new password cannot be the same as the old password!');
  }

  return response;
}

async function abortChangePassword() {
  const response = await fetch(`${API_URL}/change-password/abort`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: getCurrentUsername()
    }),
  });
  return response;
}

async function sendNewPassword(usernameOrEmail) {
  let connectionError = false;
  try {
    const response = await fetch(`${API_URL}/send-forgot-password`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
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
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
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
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
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
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
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
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
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
  return sessionStorage.getItem("username");
}

function getCurrentRole() {
  return sessionStorage.getItem("role");
}

function getCurrentEmail() {
  return sessionStorage.getItem("email");
}

function getCurrentFullName() {
  return sessionStorage.getItem("fullName");
}

function getCurrentAvatarId() {
  return sessionStorage.getItem("avatarId");
}

function getCurrentUserId(){
  return sessionStorage.getItem("userId");
}

function setCurrentUsername(username) {
  sessionStorage.setItem('username', username);
}

async function logout() {

  await nativeFetch("http://localhost:8080/api/v1/auth/logout", {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  });

  sessionStorage.clear('username');
  sessionStorage.clear('role');
  sessionStorage.clear('email');
  sessionStorage.clear('fullName');
  sessionStorage.clear('avatarId');
  sessionStorage.clear("isFirstLogin");
  sessionStorage.clear("userId");

  invalidateTokens();

  router.go('/login');
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
  const response = await fetch(`${API_URL}/is-first-login?usernameOrEmail=${usernameOrEmail}`,{
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
  });
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
  getCurrentUserId,
  validateUsername,
  isFirstLogin, 
  abortChangePassword
};
