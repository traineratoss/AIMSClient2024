const API_URL = "http://localhost:8080/ideas";
/*
FlorinCP:

pageSize = numarul de elemente pe pagina
pageNumber = numarul pagini , 0 prima pagina si asa mai departe
sortCategory = categoria dupa care se face sortarea
sortDirection = cum vrei sa sortezi , ASC sau DSC
*/
async function loadPagedIdeas(
  pageSize,
  pageNumber,
  sortCategory,
  sortDirection
) {
  const response = await fetch(
    API_URL +
      "/getAllIdeas/page?pageSize=" +
      pageSize +
      "&pageNumber=" +
      pageNumber +
      "&sortCategory=" +
      sortCategory +
      "&sortDirection=" +
      sortDirection
  );

  const data = await response.json();
  const content = await data.content;
  return content;
}
async function getCategory() {
  const response = await fetch(`http://localhost:8080/categories`);
  const json = await response.json();
  return json;
}
async function getUser(pageSize, pageNumber, sortCategory) {
  const response = await fetch(
    `${API_URL}/users/all?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`
  );
  const json = await response.json();
  const content = await json.content;
  return content;
}

async function filterIdeas(
  title,
  text,
  status,
  category,
  pageNumber,
  sortDirection
) {
  let url = `${API_URL}/ideas/filterIdeas?pageNumber=${pageNumber}&sortDirection=${sortDirection}`;

  if (title) url += `&title=${title}`;
  if (text) url += `&text=${text}`;
  if (status) url += `&status=${status}`;
  if (category.length != 0) url += `&category=${category}`;

  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  }); // add this line
  const data = await response.json();
  const content = await data.content;
  return content;
}

async function createIdea(title, status, text, categoryList, username) {
  const response = await fetch(API_URL + "/createIdea?username=" + username, {
    method: "POST",
    body: JSON.stringify({
      title: title,
      status: status,
      text: text,
      categoryList: categoryList,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();
  const content = await data.content;
  console.log(data);
}

async function getImage() {
  const response = await fetch(`http://localhost:8080/images`);
  const json = await response.json();
  return json;
}

<<<<<<< HEAD
export {
  loadPagedIdeas,
  createIdea,
  getCategory,
  getUser,
  getImage,
  filterIdeas,
};
=======
export { loadPagedIdeas, createIdea, getCategory, getUser, getImage , filterIdeas};
>>>>>>> 2be47b6b159a3396a3c46dd562ae8ab0f6496b8a
