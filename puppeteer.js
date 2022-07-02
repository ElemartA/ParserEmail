import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";

export const getPageContent = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--allow-external-pages",
        "--allow-third-party-modules",
        "--data-reduction-proxy-http-proxies",
        "--no-sandbox",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );
    await page.goto(url);
    await page.content();
    await page.$eval("#Email", (el) => (el.value = "your email"));
    await page.$eval("#Password", (el) => (el.value = "your password"));
    await page.click("#account > button");
    await page.waitForSelector("#logo > a");
    await page.click("#logo > a");
    await page.click(
      "#footer > div.footer-middle-section > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > a"
    );

    for (let i = 1; i <= 1644; i++) {
      await page.goto(`https://rdw.by/Cvs/Cvs/Index/${i}`);
      const pageContent = await page.content();
      const selector = cheerio.load(pageContent);
      selector("span.button.ripple-effect.padding-5").each((i, element) => {
        const title = selector(element).data("originalTitle");
        const checkTitle = title || "";
        const str = checkTitle.split(" ")[1];
        const checkStr = str || "";
        const str2 = checkStr.split(">")[1];
        const checkStr2 = str2 || "";
        const email = checkStr2.split("<")[0];
        fs.appendFileSync("./data.txt", `${email}\n`);
        console.log("title", email);
      });
    }

    await browser.close();
  } catch (e) {
    throw e;
  }
};

getPageContent("https://rdw.by/Identity/Account/Login");
