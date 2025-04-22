
// const city = 'Mumbai';
const API_BASE_URL = 'http://localhost:8081';

async function fetchData(endpoint) {
  try {
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

async function postData(endpoint, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

const fetchWeather = async (city) => {
  try {
    const response = await fetch(`https://mood-journal-apiwiz-3.onrender.com/weather?city=${city}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

export { fetchData, postData, fetchWeather };
