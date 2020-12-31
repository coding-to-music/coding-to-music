let msgString = '';
const puppeteer = require('puppeteer');
class PuppeteerService {
  browser;
  page;

  async init() {
    console.log("In puppeteerService - Opening the browser......");
    this.browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox"],
      'ignoreHTTPSErrors': true
  });

  console.log("In puppeteerService - after the async init......");

}

  // '--no-sandbox',
  // '--disable-setuid-sandbox',
  // '--disable-infobars',
  // '--window-position=0,0',
  // '--ignore-certifcate-errors',
  // '--ignore-certifcate-errors-spki-list',
  // '--incognito',
  // '--proxy-server=http=194.67.37.90:3128',
  // headless: false,
  // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"', //
  /**
   *
   * @param {string} url
   */
  async goToPage(url) {
    console.log("In puppeteerService - goToPage - ......");
    if (!this.browser) {
      await this.init();
    }
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US',
    });

    await this.page.goto(url, {
      waitUntil: `networkidle0`,
    });
  }

  async close() {
    console.log("In puppeteerService - close - ......");
    await this.page.close();
    await this.browser.close();
  }

  /**
   *
   * @param {string} acc Account to crawl
   * @param {number} n Qty of image to fetch
   */
  async getLatestInstagramPostsFromAccount(acc, n) {
    console.log(`In puppeteerService - getLatestInstagramPostsFromAccount - ...... ${acc}`);
    console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
    console.log('\x1b[33m%s\x1b[0m', 'stringToMakeYellow');  //yellow
    const page = `https://www.picuki.com/profile/${acc}`;
    await this.goToPage(page);

    let previousHeight;

    try {
      msgString = `In puppeteerService - getLatestInstagramPostsFromAccount - ...... About to Try for page.evaluate`;
      console.log('\x1b[31m%s\x1b[0m', msgString);  //yellow

      previousHeight = await this.page.evaluate(`document.body.scrollHeight`);

      msgString = `In puppeteerService - getLatestInstagramPostsFromAccount - ...... previousHeight ${previousHeight}`;
      console.log('\x1b[31m%s\x1b[0m', msgString);  //yellow

      await this.page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);

      msgString = `In puppeteerService - getLatestInstagramPostsFromAccount - ...... just did page.evaluate ScrollHeight`;
      console.log('\x1b[31m%s\x1b[0m', msgString);  //yellow
      // await this.page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);

      msgString = `In puppeteerService - getLatestInstagramPostsFromAccount - ...... just did page.waitForFunction about to waitFor(1000)`;
      console.log('\x1b[31m%s\x1b[0m', msgString);  //yellow

      await this.page.waitFor(1000);

      const nodes = await this.page.evaluate(() => {
        const images = document.querySelectorAll(`.post-image`);
        return [].map.call(images, img => img.src);
      });

      return nodes.slice(0, 3);
    } catch (error) {
      console.log('Error', error);
      process.exit();
    }
  }

  // async getLatestMediumPublications(acc, n) {
  //   const page = `https://medium.com/${acc}`;

  //   await this.goToPage(page);

  //   console.log('PP', page);
  //   let previousHeight;

  //   try {
  //     previousHeight = await this.page.evaluate(`document.body.scrollHeight`);
  //     console.log('MED1');
  //     await this.page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
  //     console.log('MED2', previousHeight);
  //     await this.page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
  //     console.log('MED3');
  //     await this.page.waitFor(1000);
  //     console.log('MED4');

  //     const nodes = await this.page.evaluate(() => {
  //       const posts = document.querySelectorAll('.fs.ft.fu.fv.fw.z.c');
  //       return [].map.call(posts);
  //     });
  //     console.log('POSTS', nodes);
  //     return;
  //   } catch (error) {
  //     console.log('Error', error);
  //     process.exit();
  //   }
  // }
}

const puppeteerService = new PuppeteerService();

module.exports = puppeteerService;