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
      today.getUTCFullYear() + "-" + month + "-" + today.getDate();

    url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${newSelectedDateTo}`;
    console.log(selectedDateFrom, " --> ", newSelectedDateTo);
  } else if (
    (selectedDateFrom === undefined || selectedDateFrom === "") &&
    selectedDateTo !== undefined &&
    selectedDateTo !== ""
  ) {
    url = `${API_URL}/filteredStats?&selectedDateFrom=2010-01-01&selectedDateTo=${selectedDateTo}`;
    console.log("2010-01-01 --> ", selectedDateTo);
  } else {
    url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${selectedDateTo}`;
    console.log(selectedDateFrom, " --> ", selectedDateTo);
  }

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

async function getStats() {
  const response = await fetch(API_URL + "/stats");
  const data = await response.json();
  return data;
}

export { getStats, sendDataForCustomStats };
