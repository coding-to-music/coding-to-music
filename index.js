require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');

const MUSTACHE_MAIN_DIR = './main.mustache';
/**
  * DATA is the object that contains all
  * the data to be provided to Mustache
  * Notice the "name" and "date" property.
*/
console.log("In index.js......");

let DATA = {
  name: 'Tom',
  refresh_date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'America/New_York',
  }),
};
/**
  * A - We open 'main.mustache'
  * B - We ask Mustache to render our file with the data
  * C - We create a README.md file with the generated output
  */

 async function setWeatherInformation() {
  console.log("In setWeatherInformation - just arrived ......");
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=stockholm&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  )
    .then(r => r.json())
    .then(r => {
      console.log("In setWeatherInformation - then section BEFORE ......");
      DATA.city_temperature = Math.round(r.main.temp);
      DATA.city_weather = r.weather[0].description;
      DATA.city_weather_icon = r.weather[0].icon;
      DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
      });
      DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
      });
      console.log("In setWeatherInformation - then section AFTER ......");
      console.log(JSON.stringify(DATA));

    });
}

async function setInstagramPosts() {
  console.log("In setInstagramPosts - ......");
  const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('visitstockholm', 3);
  DATA.img1 = instagramImages[0];
  DATA.img2 = instagramImages[1];
  DATA.img3 = instagramImages[2];
}

async function generateReadMe() {
  console.log("In setInstagramPosts - ......");
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  /**
   * Fetch Weather
   */
  console.log("In action - about to await setWeatherInformation ......");
  await setWeatherInformation();

  /**
   * Get pictures
   */
  console.log("In action - about to await setInstagramPosts ......");
  await setInstagramPosts();

  /**
   * Generate README
   */
  console.log("In action - about to await generateReadMe ......");
  await generateReadMe();

  /**
   * Fermeture de la boutique 👋
   */
  console.log("In action - about to await puppeteerService.close ......");
  await puppeteerService.close();
}

console.log("In Index - about to call action ......");
action();