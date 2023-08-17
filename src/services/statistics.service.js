const API_URL = "http://localhost:8080/aims/api/v1/statistics";

async function sendDataForCustomStats(selectedDateFrom, selectedDateTo) {
  let url = "";

  if (selectedDateFrom !== undefined && selectedDateTo === undefined) {
    const today = new Date();
    const month =
      today.getMonth() < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1;

    const newSelectedDateTo =
      today.getUTCFullYear() + "-" + month + "-" + today.getDate();

    url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${newSelectedDateTo}`;
  } else {
    url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${selectedDateTo}`;
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
