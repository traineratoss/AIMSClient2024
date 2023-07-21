const API_URL = "http://localhost:8080/ideas";
// http://localhost:8080/ideas/all?pageSize=4&pageNumber=0&sortCategory=id&ideaId=0

async function loadComments(pageSize, pageNumber, sortCategory, ideaId) {
  await fetch(
    API_URL +
      "/all?pageSize=" +
      pageSize + // numarul de elemente pe pagina
      "&pageNumber=" +
      pageNumber + // numarul pagini , 0 prima pagina si asa mai departe
      "&sortCategory=" +
      sortCategory + // categoria dupa care se face sortarea
      "&ideaId=" +
      ideaId // id ul ideei pentru care vrei comentariile
  ).then((response) => console.log(response.json()));
}

async function postComment(username, ideaId, commentText) {
  const response = await fetch(API_URL + "/", {
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

  console.log(data);
}

async function postCommentsbyIdeaId(username, ideaId, commentText) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      ideaId: ideaId,
      commentText: commentText,
    }),
  };
  fetch(API_URL + "/", requestOptions).then((response) =>
    console.log(response.json())
  );
}

export { loadComments, postComment, postCommentsbyIdeaId };
