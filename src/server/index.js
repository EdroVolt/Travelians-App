// Setup empty JS object to act as endpoint for all routes
let projectData = {};

const dotenv = require("dotenv");
dotenv.config();

/* geoname API variables */
const username = process.env.USER_NAME;

/* weatherbit API variables */
const weatherKey = process.env.WEATHER_KEY;

/* pixabay API variables */
const pexKey = process.env.PEX_KEY;

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// fetch method for sending requests
const fetch = require("node-fetch");

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
const port = 8083;
const server = app.listen(port, listening);

function listening() {
    console.log(`server running on port: ${port}`);
}

app.get("/", function (req, res) {
    res.sendFile("dist/index.html");
});

// POST: data
app.post("/data", retriveData);

async function retriveData(req, res) {
    const location = req.body.location;
    const dayes = req.body.dayes;

    projectData = await getInformations(location, dayes);

    res.send(projectData);
}

// GET async function
async function getData(url = "") {
    const response = await fetch(url);

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (e) {
        console.log(e);
    }
};

// get infomation about travel 
async function getInformations(location, dayes) {
    const locationData = await getData(
        `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${username}`
    );
    const lat = locationData.geonames[0].lat;
    const lng = locationData.geonames[0].lng;

    console.log(locationData.geonames[0].lat);
    console.log(locationData.geonames[0].lng);

    let weatherResponse = {};

    if (dayes <= 7) {
        weatherResponse = await getData(
            `https://api.weatherbit.io/v2.0/current?key=${weatherKey}&lat=${lat}&lon=${lng}`
        );
    } else {
        weatherResponse = await getData(
            `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherKey}&lat=${lat}&lon=${lng}`
        );
    }

    const weatherData = weatherResponse.data[0];

    console.log(weatherData);

    let locationImageResponse = await getData(
        `https://pixabay.com/api/?key=${pexKey}&q=${location}&image_type=photo`
    );

    let locationImage = "";
    try {
        locationImage = locationImageResponse.hits[0].largeImageURL;
        console.log(locationImage);
    } catch {
        locationImageResponse = await getData(
            `https://pixabay.com/api/?key=${pexKey}&q=404&image_type=photo`
        );
        locationImage = locationImageResponse.hits[0].largeImageURL;
        console.log(locationImage);
    }

    return {
        locationImage: locationImage,
        weatherData: weatherData,
    };
}

module.exports = {
    getInformations
}