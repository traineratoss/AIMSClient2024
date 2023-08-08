import TermsAndConditionsView from "../views/TermsAndConditionsView.vue";

const API_URL = "http://localhost:8080/aims/api/v1/ideas";
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
      "/all?pageSize=" +
      pageSize +
      "&pageNumber=" +
      pageNumber +
      "&sortCategory=" +
      sortCategory +
      "&sortDirection=" +
      sortDirection,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
  );
  const data = await response.json();
  return data;
}

async function getCategory() {
  const response = await fetch(
    `http://localhost:8080/aims/api/v1/ideas/categories/all`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
  );
  const json = await response.json();
  return json;
}

async function getUser(pageSize, pageNumber, sortCategory) {
  const response = await fetch(
    `http://localhost:8080/users/all?pageSize=${pageSize}&pageNumber=${pageNumber}&sortCategory=${sortCategory}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
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
  user,
  selectedDateFrom,
  selectedDateTo,
  pageNumber,
  pageSize,
  username,
  sortDirection
) {

  switch (sortDirection) {
    case 0:
      sortDirection = "ASC";
      break;
    case 1:
      sortDirection = "DESC";
      break;
  }
  if (pageNumber < 0) {
    pageNumber = 0;
  }
  
  let url = `${API_URL}/filter?pageNumber=${pageNumber}&sortDirection=${sortDirection}&pageSize=${pageSize}`;
  
  if (title) url += `&title=${title}`;
  if (text) url += `&text=${text}`;
  if (status.length != 0) url += `&status=${status}`;
  if (category.length != 0) url += `&category=${category}`;
  if (user.length != 0) url += `&user=${user}`;
  if (selectedDateFrom) url += `&selectedDateFrom=${selectedDateFrom}`;
  if (selectedDateTo) url += `&selectedDateTo=${selectedDateTo}`;
  if (username) url += `&username=${username}`;

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

async function sendDataForCustomStats(
  selectedDateFrom,
  selectedDateTo
) {
 

  let url = `${API_URL}/new-stats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${selectedDateTo}`;
  
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

async function getIdea(id) {
  const response = await fetch(API_URL + "/get?id=" + id, {
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

async function updateIdea(id, title, text, status, categoryList, image) {
  const response = await fetch(API_URL + "/update?id=" + id, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    body: JSON.stringify({
      title: title,
      text: text,
      status: status.toUpperCase(),
      categoryList: categoryList,
      image: image
    }),
    redirect: "follow",
    referrerPolicy: "no-referrer",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();
  return data;
}

async function createIdea(title, text, status, categoryList, image, username) {
  const response = await fetch(API_URL + "/create?username=" + username, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      title: title,
      text: text,
      status: status.toUpperCase(),
      image: image,
      categoryList: categoryList,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const data = await response.json();
  const content = await data.content;
}

async function getAllImages() {
  const response = await fetch(`http://localhost:8080/aims/api/v1/images`);
  const data = await response.json();
  return data;
}

async function getPagedIdeasFromUser(
  username,
  pageSize,
  pageNumber,
  sortDirection
) {
  switch (sortDirection) {
    case 0:
      sortDirection = "ASC";
      break;
    case 1:
      sortDirection = "DESC";
      break;
  }

  if (pageNumber < 0) {
    pageNumber = 0;
  }

  let url = `${API_URL}/allByUser?pageNumber=${pageNumber}&sortDirection=${sortDirection}&pageSize=${pageSize}&username=${username}&sortCategory=creationDate`;

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

  console.log(response);
  const json = await response.json();
  return json;
}

async function getImageById() {
  const response = await fetch("http://localhost:8080/aims/api/v1/images/");
  const data = await response.json();
  return data;
}

async function getImageByIdeaId(ideaId) {
  const response = await fetch("http://localhost:8080/aims/api/v1/images/getByIdea?id=" + ideaId);
  const data = await response.json();
  return data;
}

async function getStats() {
  const response = await fetch(API_URL + "/stats");
  const data = await response.json();
  return data;
}
async function deleteIdea(ideaId) {
  return fetch("http://localhost:8080/aims/api/v1/ideas/delete?id=" + ideaId, {
    method: "DELETE",
  });
}
export {
  loadPagedIdeas,
  createIdea,
  getCategory,
  getUser,
  getAllImages,
  filterIdeas,
  getPagedIdeasFromUser,
  getIdea,
  getStats,
  updateIdea,
  deleteIdea,
  sendDataForCustomStats,
  getImageById,
  getImageByIdeaId
};
