const baseUrl = "http://localhost:8080/aims/api/v1/ideas";

export async function postRating(ideaId, userId, ratingValue) {
  const url = `${baseUrl}/ratings`;
  const params = new URLSearchParams({
    ideaId,
    userId,
    ratingValue,
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: null, 
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function getRating(ideaId, userId) {
  const url = `${baseUrl}/getRating`;
  const params = new URLSearchParams({
    ideaId,
    userId,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Unexpected Error", error);
    throw error;
  }
}
