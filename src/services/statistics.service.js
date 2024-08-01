const API_URL = "http://localhost:8080/aims/api/v1/statistics";

async function sendDataForCustomStats(selectedDateFrom, selectedDateTo) {
  let url = "";

  if (
    selectedDateFrom !== undefined &&
    selectedDateFrom !== "" &&
    (selectedDateTo === undefined || selectedDateTo === "")
  ) {
    const today = new Date();
    const month =
      today.getMonth() < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1;

    const newSelectedDateTo =
      today.getUTCFullYear() + "-" + month + "-" + (today.getDate() + 1);

    url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${newSelectedDateTo}`,{
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
    };
  } else if (
    (selectedDateFrom === undefined || selectedDateFrom === "") &&
    selectedDateTo !== undefined &&
    selectedDateTo !== ""
  ) {
    const today = new Date();
    const month =
      today.getMonth() < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1;

    let newSelectedDateTo =
      today.getUTCFullYear() + "-" + month + "-" + today.getDate();
    if (selectedDateTo === newSelectedDateTo) {
      newSelectedDateTo =
        today.getUTCFullYear() + "-" + month + "-" + (today.getDate() + 1);
      url = `${API_URL}/filteredStats?&selectedDateFrom=2010-01-01&selectedDateTo=${newSelectedDateTo}`,{
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
      };
    } else {
      url = `${API_URL}/filteredStats?&selectedDateFrom=2010-01-01&selectedDateTo=${selectedDateTo}`,{
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
      };
    }
  } else if (
    (selectedDateFrom === undefined || selectedDateFrom === "") &&
    (selectedDateTo === undefined || selectedDateTo === "")
  ) {
    const today = new Date();
    const month =
      today.getMonth() < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1;

    let newSelectedDateTo =
      today.getUTCFullYear() + "-" + month + "-" + today.getDate();
    url = `${API_URL}/filteredStats?&selectedDateFrom=2010-01-01&selectedDateTo=${newSelectedDateTo}`;
  } else {
    const today = new Date();
    const month =
      today.getMonth() < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1;

    let newSelectedDateTo =
      today.getUTCFullYear() + "-" + month + "-" + today.getDate();
    if (selectedDateTo === newSelectedDateTo) {
      newSelectedDateTo =
        today.getUTCFullYear() + "-" + month + "-" + today.getDate();
      url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${newSelectedDateTo}`;
    } else
      url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${selectedDateTo}`,{
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
      };
  }

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  const data = await response.json();
  return data;
}

async function getStats() {
  let url = API_URL + "/stats";

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  const data = await response.json();
  return data;
}

export { getStats, sendDataForCustomStats };
