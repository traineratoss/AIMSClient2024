import axios from "axios";

export async function postRating(idea_id, user_id, ratingValue) {
  const response = await axios.post("http://localhost:8080/aims/api/v1/ideas/ratings", null, {
    params: {
      idea_id,
      user_id,
      ratingValue,
    }
  });
  return response.data;
}

export async function getRating(ideaId, userId) {
  const response = await axios.get("http://localhost:8080/aims/api/v1/ideas/getRating", {
    params: {
      ideaId,
      userId,
    }
  });
  return response.data;
}
