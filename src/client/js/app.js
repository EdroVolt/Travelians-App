// Create a new date instance dynamically with JS
let d = new Date();
let currentDate =
  d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

// POST async function
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (e) {
    console.log(e);
  }
}

// updateUI function
function updateUI(locationImage, weatherData) {
  const divResult = document.createElement("div");
  divResult.classList.add("result");

  const image = document.createElement("img");
  image.setAttribute("src", locationImage);

  const divInfo = document.createElement("div");
  divInfo.classList.add("info");
  divInfo.innerHTML =
    `location: ${weatherData.city_name} <br> temp: ${weatherData.app_temp}` +
    `<br> clouds: ${weatherData.clouds} <br> snow: ${weatherData.snow}`;

  const btnCancel = document.createElement("button");
  btnCancel.textContent = "cancel";
  btnCancel.addEventListener("click", (e) => {
    e.target.parentElement.parentElement.remove();
  });

  // append childs
  divInfo.appendChild(btnCancel);
  divResult.append(image);
  divResult.append(divInfo);

  document.querySelector("#app").appendChild(divResult);
}

// add Event listener for button click
function checkoutHandler() {
  document.querySelector("button").addEventListener("click", getInformations);
}

// callback function for the button click event
async function getInformations() {
  const location = document.querySelector(".location").value;
  const date = document.querySelector(".date").value;

  // calculate how far the trip date
  const dayes = Math.round(
    Math.abs(new Date() - new Date(date.replace(/-/g, "/"))) /
      (1000 * 60 * 60 * 24)
  );

  const response = await postData("/data", {
    location: location,
    dayes: dayes,
  });

  updateUI(response.locationImage, response.weatherData);
}

export { checkoutHandler, getInformations, updateUI };
