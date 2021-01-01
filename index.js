require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');

const CB  = '\033[0;30m' // Black         0;30     
const CDG = '\033[1;30m' // Dark Gray     1;30
const CR  = '\033[0;31m' // Red           0;31     
const CLR = '\033[1;31m' // Light Red     1;31
const CG  = '\033[0;32m' // Green         0;32     
const CLG = '\033[1;32m' // Light Green   1;32
const CBO = '\033[0;33m' // Brown/Orange  0;33     
const CY  = '\033[1;33m' // Yellow        1;33
const CBL = '\033[0;34m' // Blue          0;34     
const CLB = '\033[1;34m' // Light Blue    1;34
const CP  = '\033[0;35m' // Purple        0;35     
const CLP = '\033[1;35m' // Light Purple  1;35
const CC  = '\033[0;36m' // Cyan          0;36     
const CLC = '\033[1;36m' // Light Cyan    1;36
const CLGY= '\033[0;37m' // Light Gray    0;37     
const CW  = '\033[1;37m' // White         1;37
const RED='\033[0;31m'
const NC='\033[0m' // No Color


console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
console.log('\x1b[33m%s\x1b[0m', 'stringToMakeYellow 36');  //yellow
console.log('\x1b[30m%s\x1b[0m', 'stringToMakeYellow 30');  //yellow
console.log('\x1b[31m%s\x1b[0m', 'stringToMakeYellow 31');  //yellow
console.log('\x1b[32m%s\x1b[0m', 'stringToMakeYellow 32');  //yellow
console.log('\x1b[33m%s\x1b[0m', 'stringToMakeYellow 33');  //yellow
console.log('\x1b[34m%s\x1b[0m', 'stringToMakeYellow 34');  //yellow
console.log('\x1b[35m%s\x1b[0m', 'stringToMakeYellow 35');  //yellow
console.log('\x1b[36m%s\x1b[0m', 'stringToMakeYellow 36');  //yellow
console.log('\x1b[37m%s\x1b[0m', 'stringToMakeYellow 37');  //yellow
console.log('\x1b[38m%s\x1b[0m', 'stringToMakeYellow 38');  //yellow



const MUSTACHE_MAIN_DIR = './main.mustache';
/**
  * DATA is the object that contains all
  * the data to be provided to Mustache
  * Notice the "name" and "date" property.
*/
console.error("${{RED}}In index.js......${{NC}}");

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
    `https://api.openweathermap.org/data/2.5/weather?q=boston&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=imperial`
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
        // timeZone: 'America/New_York',
      });
      DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        // timeZone: 'America/New_York',
      });
      console.log("In setWeatherInformation - then section AFTER ......");
      console.log(JSON.stringify(DATA));

    });
}

async function setInstagramPosts() {
  // console.log('%c\uD83D\uDE09 Giant Rainbow Text!', 
  //           'font-weight:bold; font-size:50px;color:red; ' +
  //           'text-shadow:3px 3px 0 red,6px 6px 0 orange,9px 9px 0 yellow, ' +
  //           '12px 12px 0 green,15px 15px 0 blue,18px 18px 0 indigo,21px 21px 0 violet');
  console.log("In setInstagramPosts - ......Entering");
  const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('thomasconnors44/', 3);
  DATA.img1 = instagramImages[0];
  DATA.img2 = instagramImages[1];
  DATA.img3 = instagramImages[2];

  console.log("In setInstagramPosts - then section AFTER ......");
  console.log(JSON.stringify(DATA));

}

async function generateReadMe() {
  console.log("In generateReadMe - ......");
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log("In generateReadMe - ......writeFileSync(README.md");
  });
  console.log("In generateReadMe - ......Exiting");
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