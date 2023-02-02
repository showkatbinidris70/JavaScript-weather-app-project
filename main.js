// UI
// Data Layer
// local storage
const storage = {
    city: "",
    country: "",
    saveItem() {
        localStorage.setItem("BD-city", this.city);
        localStorage.setItem("BD-country", this.country);
    },
    getItem() {
        const city = localStorage.getItem("BD-city");
        const country = localStorage.getItem("BD-country");
        return {city, country};
    }
};
const weatherData = {
    city: "",
    country: "",
    API_KEY: "af8a3213669837b26a91e21faeaa19aa",
    async getWeather() {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${
                this.city
            },${
                this.country
            }&units=metric&appid=${
                this.API_KEY
            }`);
            const {name, main, weather} = await res.json();
            // const data = await res.json();
            // console.log(data);
            // console.log(await res.json());
            return {name, main, weather};
        } catch (err) {
            console.log(err);
            UI.showMessage("Error in fetching data");
        }
    }
};

const UI = {
    loadSelectors() {
        const cityElm = document.querySelector("#city");
        const cityInfoElm = document.querySelector("#w-city");
        const iconElm = document.querySelector("#w-icon");
        const temperatureElm = document.querySelector("#w-temp");
        const pressureElm = document.querySelector("#w-pressure");
        const humidityElm = document.querySelector("#w-humidity");
        const feelElm = document.querySelector("#w-feel");
        const formElm = document.querySelector("#form");
        const countryElm = document.querySelector("#country");
        const messageElm = document.querySelector("#messageWrapper");

        return {
            cityElm,
            cityInfoElm,
            iconElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
            formElm,
            countryElm,
            messageElm
        };
    },
    removeMessage() {
        const msgElm = document.querySelector("#message");
        setTimeout(() => {
            msgElm.remove();
        }, 2000);
    },
    showMessage(msg) {
        const {messageElm} = this.loadSelectors();
        const elm = `<div class='alert alert-danger' id='message'>${msg}</div>`;
        messageElm.insertAdjacentHTML("afterbegin", elm);
        this.removeMessage();
    },

    validateInput(country, city) {
        if (country === "" && city === "") {
            this.showMessage("Please fill up all fields !");
            return true;
        } else {
            return false;
        }
    },

    getInputValues() {
        const {countryElm, cityElm} = this.loadSelectors();
        // validation check
        const isInValid = this.validateInput(countryElm.value, cityElm.value);
        if (isInValid) 
            return;
        


        return {country: countryElm.value, city: cityElm.value};
        // console.log(countryElm.value, cityElm.value);
    },
    resetInputs() {
        const {countryElm, cityElm} = this.loadSelectors();
        countryElm.value = "";
        cityElm.value = "";
    },
    async handleRemoveData() {
        // weatherData.getWeather();
        // const {name, main, weather} = weatherData.getWeather();
        const data = await weatherData.getWeather();
        return data;
    },
    getIcon(iconCode) {
        return `https://openweathermap.org/img/w/${iconCode}.png`;
    },
    populateUI(data) {
        const {
            cityInfoElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
            iconElm
        } = this.loadSelectors();
        const {
            name,
            main: {
                temp,
                pressure,
                humidity
            },
            weather
        } = data;
        console.log(data);
        cityInfoElm.textContent = name;
        temperatureElm.textContent = `Temperature : ${temp} c`;
        pressureElm.textContent = `Pressure : ${pressure} kpa`;
        humidityElm.textContent = `Humidity : ${humidity}`;
        feelElm.textContent = weather[0].description;
        iconElm.setAttribute("src", this.getIcon(weather[0].icon));
    },
    setDataToStorage(city, country) {
        storage.city = city;
        storage.country = country;
    },
    init() {
        const {formElm} = this.loadSelectors();
        formElm.addEventListener("submit", async (event) => {
            event.preventDefault();
            // get input values
            const {country, city} = this.getInputValues();
            // setting data to data storage
            weatherData.city = city;
            weatherData.country = country;
            // setting data into localstorage object
            this.setDataToStorage();
            // saving storage
            storage.saveItem();
            storage.city = city;
            storage.country = country;
            // reset input values
            this.resetInputs();
            // console.log(country, city);
            // send data to API server
            const data = await this.handleRemoveData();
            // populate UI
            this.populateUI(data);
            // console.log(data)
        });
        window.addEventListener("DOMContentLoaded", async () => {
            let {city, country} = storage.getItem();
            if (!city || !country) {
                city = 'Dhaka',
                country = 'Bangladesh'
            }
            weatherData.city = city;
            weatherData.country = country;
            // send data to API server
            const data = await this.handleRemoveData();
            // populate UI
            this.populateUI(data);
        });
    }
};
UI.init();
