import { ApiHandler } from "sst/node/api";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";


const YOUR_LOCAL_CHROMIUM_PATH = "/tmp/localChromium/chromium/linux-1264824/chrome-linux/chrome";

export const handler = ApiHandler(async (event) => {
  const { url, width, height } = event.queryStringParameters!;

  if (!url) {
    return {
      statusCode: 400,
      body: "Please provide a url",
    };
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? YOUR_LOCAL_CHROMIUM_PATH
      : await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  if (width && height) {
    await page.setViewport({
      width: Number(width),
      height: Number(height),
    });
  }

  // Navigate to the url
  await page.goto(url!);

  // Take the screenshot
  const screenshot = (await page.screenshot({ encoding: "base64" })) as string;
  await browser.close();

  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: { "Content-Type": "image/png" },
    body: screenshot,
  };

});

