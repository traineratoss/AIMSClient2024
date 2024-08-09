import { ref } from "vue";
import { getCurrentUsername } from "./user_service";

const customAvatarImage = ref(await getAvatarImage(getCurrentUsername()));

const fetchAvatarImage = async (username) => {
  customAvatarImage.value = await getAvatarImage(username);
}

const getAvatarImageURI = () => {
  if (customAvatarImage.value) {
    return `data:image/${customAvatarImage.value.fileType};name=${customAvatarImage.value.fileName};base64,${customAvatarImage.value.image}`;
  }
}

async function getAvatarImage(username) {
  if (!username) {
    return null;
  }

  try {
    const response = await fetch(`http://localhost:8080/users/get-avatar-by-username?username=${username}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || contentType.indexOf("application/json") === -1) {
      return null;
    }

    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
}

export {
  customAvatarImage,
  getAvatarImage,
  fetchAvatarImage,
  getAvatarImageURI,
}
