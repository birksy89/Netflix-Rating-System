const puppeteer = require("puppeteer");

module.exports = {
  getMyList: async function getMyList() {
    const browser = await puppeteer.launch({
      //headless: false
    });
    const page = await browser.newPage();

    await page.goto("https://www.netflix.com/gb/login");
    //await page.screenshot({ path: "screenshots/netflix.png" });

    //usual dom element selectors
    const USERNAME_SELECTOR = "#id_userLoginId";
    const PASSWORD_SELECTOR = "#id_password";
    const BUTTON_SELECTOR =
      "#appMountPoint > div > div.login-body > div > div > div.hybrid-login-form-main > form > button";

    //Get creds
    const CREDS = require(__dirname + "/../data/netflixCreds.js");

    try {
      //Login
      await page.click(USERNAME_SELECTOR);
      await page.keyboard.type(CREDS.username);
      //Pass
      await page.click(PASSWORD_SELECTOR);
      await page.keyboard.type(CREDS.password);
      //Go
      await page.click(BUTTON_SELECTOR);
      await page.waitForNavigation();
    } catch {
      console.log("Error - Changed input selectors");

      await page.click("#email");
      await page.keyboard.type(CREDS.username);
      //Pass
      await page.click("#password");
      await page.keyboard.type(CREDS.password);
      //Go
      await page.click(".login-button");
      await page.waitForNavigation();
    }

    //Check we good
    //await page.screenshot({ path: "screenshots/netflix-logged-in.png" });

    await page.goto(
      `https://www.netflix.com/SwitchProfile?tkn=${CREDS.profileToken}`
    );
    //Check we good
    //await page.screenshot({ path: "screenshots/netflix-logged-in-switched.png" });

    await page.goto("https://www.netflix.com/browse/my-list");
    //Check we good
    //await page.screenshot({ path: "screenshots/netflix-logged-in-my-list.png" });

    // Wait for the results page to load and display the results.
    const resultsSelector = ".galleryLockups .title-card .fallback-text";
    await page.waitForSelector(resultsSelector);

    // Extract the results from the page.
    const links = await page.evaluate(resultsSelector => {
      const anchors = Array.from(document.querySelectorAll(resultsSelector));

      return anchors.map(anchor => {
        const title = anchor.innerText.trim();
        return `${title}`;
      });
    }, resultsSelector);

    console.log(links.join("\n"));

    //Save to File
    require("fs").writeFile(
      __dirname + "/../data/netflixList.json",

      JSON.stringify(links),

      function(err) {
        if (err) {
          console.error("Error writing file", err);
        }
      }
    );

    browser.close();
  }
};
