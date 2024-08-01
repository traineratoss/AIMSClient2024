import { axiosInstance } from "../main";

export async function postRating(ideaId, userId, ratingValue) {
  const response = await axiosInstance.post("http://localhost:8080/aims/api/v1/ideas/ratings", null, {
    params: {
      ideaId,
      userId,
      ratingValue,
    }
  });
  return response.data;
}

export async function getRating(ideaId, userId) {
  const response = await axiosInstance.get("http://localhost:8080/aims/api/v1/ideas/getRating", {
    params: {
      ideaId,
      userId,
    }
  });
  return response.data;
}
