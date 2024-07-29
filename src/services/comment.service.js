const API_URL = "http://localhost:8080/aims/api/v1/ideas";
/*
FlorinCP:

pageSize = numarul de elemente pe pagina
pageNumber = numarul pagini , 0 prima pagina si asa mai departe
sortCategory = categoria dupa care se face sortarea
ideaId = id ul ideei pentru care vrei comentariile
*/
async function loadComments(pageSize, pageNumber, sortCategory, ideaId) {
  const response = await fetch(
    API_URL +
      "/comments?pageSize=" +
      pageSize +
      "&pageNumber=" +
      pageNumber +
      "&sortCategory=" +
      sortCategory +
      "&ideaId=" +
      ideaId
  );

  const data = await response.json();
  return data.content;
}

async function postComment(username, ideaId, commentText) {
  const response = await fetch(API_URL + "/comments", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      ideaId: ideaId,
      commentText: commentText,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();
  return data;
}

async function postReply(username, parentId, commentText) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      parentId: parentId,
      commentText: commentText,
    }),
  };

  const response = await fetch(API_URL + "/comments/reply", requestOptions);
  const data = await response.json();

  return data;
}

async function loadReplies(pageSize, pageNumber, sortCategory, parentId) {
  const response = await fetch(
    API_URL +
      "/comments/replies?pageSize=" +
      pageSize +
      "&pageNumber=" +
      pageNumber +
      "&sortCategory=" +
      sortCategory +
      "&commentId=" +
      parentId
  );

  const data = await response.json();
  return data.content;
}

async function deleteComment(commentId) {
  return fetch(API_URL + "/comments/" + commentId, {
    method: "DELETE",
  });
  return response;
}

async function getLikesCount(commentId) {
  const response = await fetch(`${API_URL}/comments/${commentId}/likes/count`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

async function deleteLike(commentId, userId) {
  return fetch(API_URL + "/comments/like/delete/" + commentId + "/" + userId, {
    method: "DELETE",
  });
}

async function postLike(commentId, userId) {
  return fetch(API_URL + "/comments/like/" + commentId + "/" + userId, {
    method: "POST",
  });
}

async function getLike(commentId, userId) {
  
  const response = await fetch(API_URL + "/comments/like/find/" + commentId + "/" + userId, {
    method: "GET",
  });

  const text = await response.json();
  return text;
}

async function reportComment(commentId, userId) {
  const response = await fetch(API_URL + "/comments/report/" + commentId + "/" + userId, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const data = await response.json();
    return data;
  } else {
    const text = await response.text();
    return { message: text };
  }
}

async function getReport(commentId, userId) {
  
  const response = await fetch(API_URL + "/comments/report/find/" + commentId + "/" + userId, {
    method: "GET",
  });

  const text = await response.json();
  return text;
}


async function getAllCommentsByReportsNr(pageSize,pageNumber,sortCategory) {
  const response = await fetch(
    `${API_URL}/comments/allByReportsNr?pageSize=${pageSize}&pageNumber=${pageNumber}`,{
      method:"GET",
    }
  );

  const json = await response.json();
  return json;
}

async function getReportsCountForComment(commentId) {
  
  const response = await fetch(API_URL + "/comments/reports/count/" + commentId, {
    method: "GET",
  });

  const text = await response.json();
  return text;
}

export {
  loadComments,
  postComment,
  postReply,
  loadReplies,
  deleteComment,
  deleteLike,
  getLikesCount,
  postLike,
  getLike,
  reportComment,
  getAllCommentsByReportsNr,
  getReport,
  getReportsCountForComment,
};
