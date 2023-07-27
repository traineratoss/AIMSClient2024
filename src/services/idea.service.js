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
    `http://localhost:8080/users/all?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`
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
  let url = `${API_URL}/filterIdeas?pageNumber=${pageNumber}&sortDirection=${sortDirection}`;

  if (title) url += `&title=${title}`;
  if (text) url += `&text=${text}`;
  if (status) url += `&status=${status}`;
  if (category.length != 0) url += `&category=${category}`;

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  const data = await response.json();
  return data;
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

export {
  loadPagedIdeas,
  createIdea,
  getCategory,
  getUser,
  getImage,
  filterIdeas,
};
