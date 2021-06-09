import puppeteer from 'puppeteer';

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
  it('finds the button, textarea, and code oupt', async () => {
    await sleep(1_000);

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

    const code = await page.$('pre');
    if (!code) {
      throw new Error("Can't find the textarea to input code");
    }

    inputText.type('1 + 1');
    await sleep(1000);
    const inputTextValue = await inputText.evaluate((el) => el.textContent);
    expect(inputTextValue).toBe('1 + 1');

    btn.click();
    await sleep(1000);

    let expected = '"(() => {\\n  // a:index.js\\n  1 + 1;\\n})();\\n"';
    let codeTextValue: string | null = JSON.stringify(
      await code.evaluate((el) => el.textContent)
    );
    await sleep(500);
    expect(codeTextValue).toBe(expected);
  });

  afterAll(async () => await browser?.close?.());
});
