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
  console.log(data.content);
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

  console.log(username);
  const data = await response.json();
  console.log(data);

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
  console.log(data);

  return data;
}

async function loadReplies(commentId) {
  const response = await fetch(
    API_URL + "/comments/replies?commentId=" + commentId
  );

  const data = await response.json();
  console.log(data);
  return data;
}

async function deleteComment(commentId) {
  return fetch(API_URL + "/comments?commentId=" + commentId, {
    method: "DELETE",
  });
  return response;
}

export { loadComments, postComment, postReply, loadReplies, deleteComment };
