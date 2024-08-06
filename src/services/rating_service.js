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

export async function getAllRatings(userId) {
  const url = 'http://localhost:8080/aims/api/v1/ideas/getAllRatings';
  const params = new URLSearchParams({
    userId,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with an error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting ratings:', error);
    throw error;
  }
}

export async function getRating(ideaId, userId) {
  const url = 'http://localhost:8080/aims/api/v1/ideas/getRating';
  const params = new URLSearchParams({
    ideaId,
    userId,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with an error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting ratings:', error);
    throw error;
  }
}

export async function getNumberOfRatings(ideaId) {
  const url = 'http://localhost:8080/aims/api/v1/ideas/countRatings';
  const params = new URLSearchParams({
    ideaId,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with an error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting ratings:', error);
    throw error;
  }
}



