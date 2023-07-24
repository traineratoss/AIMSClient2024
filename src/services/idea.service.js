const API_URL = "http://localhost:8080/ideas";
/*
FlorinCP:

pageSize = numarul de elemente pe pagina
pageNumber = numarul pagini , 0 prima pagina si asa mai departe
sortCategory = categoria dupa care se face sortarea
sortDirection = cum vrei sa sortezi , ASC sau DSC
*/
async function loadPagedIdeas(pageSize, pageNumber, sortCategory, sortDirection) {
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

export {loadPagedIdeas}