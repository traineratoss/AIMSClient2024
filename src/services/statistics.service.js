const API_URL = "http://localhost:8080/aims/api/v1/statistics";

async function sendDataForCustomStats(selectedDateFrom, selectedDateTo) {
  let url = `${API_URL}/filteredStats?&selectedDateFrom=${selectedDateFrom}&selectedDateTo=${selectedDateTo}`;

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
