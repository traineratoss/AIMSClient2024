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
  const response = await fetch(`${API_URL}/categories`);
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

export {loadPagedIdeas, createIdea, getCategory, getUser}
