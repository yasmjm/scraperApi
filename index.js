const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
chromium.setGraphicsMode = false;

const uuid = require('uuid').v4

const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(client);


async function scraper() {
  let browser
  try {
    browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    const page = await browser.newPage();
    await page.goto('https://www.amazon.com.br/gp/bestsellers');
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('.p13n-sc-uncoverable-faceout .a-link-normal:nth-child(even)');

      const postArray = Array.from(postElements).map(post => {
        const title = post.innerText;
        const url = post.href

        return { title, url };
      });

      return postArray.slice(0, 3)
    });

    console.log(JSON.stringify(posts))

    await Promise.all(posts.map(async el => {
      const command = new PutCommand({
        TableName: 'Products',
        Item: {
          id: uuid(),
          title: el.title,
          url: el.url,
          date: (new Date()).toLocaleDateString('pt-BR')
        }
      })
      const res = await ddb.send(command);
      console.log('Produto cadastrado: ' + JSON.stringify(el))
    }))

  } catch (error) {
    console.log(error)
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};


async function api(event) {

  const command = new ScanCommand({
    TableName: "Products"
  });

  const res = await client.send(command);

  return { statusCode: 200, body: JSON.stringify(res) }
}

(async () => {
  await scraper()
})()

module.exports = {
  scraper,
  api
}