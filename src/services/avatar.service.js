import { ref } from "vue";

const customAvatarImage = ref(null);

const fetchAvatarImage = async (username) => {
  customAvatarImage.value = await getAvatarImage(username);
  console.log(username);
  console.log(customAvatarImage.value);
}

const getAvatarImageURI = () => {
  if (customAvatarImage) {
    console.log(customAvatarImage.value);
    return `data:image/${customAvatarImage.value.fileType};name=${customAvatarImage.value.fileName};base64,${customAvatarImage.value.image}`;
  }
}

async function getAvatarImage(username) {
  try {
    const response = await fetch(`http://localhost:8080/users/get-avatar-by-username?username=${username}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.log("User has no custom avatar image");
    return null;
  }
}

export {
  customAvatarImage,
  getAvatarImage,
  fetchAvatarImage,
  getAvatarImageURI,
}
