import puppeteer from 'puppeteer';

jest.setTimeout(100000);
let browser: puppeteer.Browser | undefined;
let page: puppeteer.Page | undefined;

const sleep = async (ms: number) =>
  await new Promise((res) => setTimeout(res, ms));

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();

  await page.goto('http://localhost:3000');
}, 30_000);

describe('App', () => {
  it('finds the button, textarea, and code output', async () => {
    await sleep(1000);

    if (!page) {
      throw new Error('Error while loading Puppeteer page');
    }

    // Find elements
    const formatBtn = await page.$('#format');
    if (!formatBtn) {
      throw new Error("Can't find the increase counter button");
    }

    const submitBtn = await page.$('#submit');
    if (!submitBtn) {
      throw new Error("Can't find the increase counter button");
    }

    const codeEditor = await page.$('.code-editor');
    if (!codeEditor) {
      throw new Error("Can't find the textarea to input code");
    }

    const codeOutput = await page.$('iframe');
    if (!codeOutput) {
      throw new Error("Can't find the code output");
    }

    // codeEditor starts with default value of
    // "document.querySelector('#root').innerHTML = 'Hello World';"
    formatBtn.click(); // format the content using Prettier
    await sleep(250);

    submitBtn.click(); // transpile and transmit code to iframe
    await sleep(250);

    let expected = 'Hello World';
    const frame = await codeOutput.contentFrame();
    const frameContent = await frame?.content(); // Get html of iframe

    expect(frameContent?.includes(expected)).toBe(true);
  });

  afterAll(async () => await browser?.close?.());
});
