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
    const btn = await page.$('button');
    if (!btn) {
      throw new Error("Can't find the increase counter button");
    }

    const inputText = await page.$('textarea');
    if (!inputText) {
      throw new Error("Can't find the textarea to input code");
    }

    const codeOutput = await page.$('iframe');
    if (!codeOutput) {
      throw new Error("Can't find the code output");
    }

    inputText.type(
      `document.querySelector('#root').innerHTML = 'Hello World';`
    );
    await sleep(4000);
    const inputTextValue = await inputText.evaluate((el) => el.textContent);
    expect(inputTextValue).toBe(`document.querySelector('#root').innerHTML = 'Hello World';`);

    btn.click();
    await sleep(2000);

    let expected = 'Hello World';
    const frame = await codeOutput.contentFrame();
    const frameContent = await frame?.content();

   expect(frameContent?.includes(expected)).toBe(true);
  });

  afterAll(async () => await browser?.close?.());
});
