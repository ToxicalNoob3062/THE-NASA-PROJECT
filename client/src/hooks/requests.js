const API_URL = "http://localhost:8000/v1";
async function httpGetPlanets() {
  const res = await fetch(`${API_URL}/planets`);
  const planets = await res.json();
  return planets;
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const res = await fetch(`${API_URL}/launches`);
  const launches = await res.json();
  return launches;
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    };
  }

  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    };
  }
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
