const chrome = require('chrome-aws-lambda');
const uuid = require('uuid').v4
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });


async function handler() {
  const browser = await chrome.puppeteer.launch({
    executablePath: await chrome.executablePath,
    defaultViewport: chrome.defaultViewport,
    headless: true,
    args: chrome.args
  });
  try {
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    const page = (await browser.pages())[0];

    await page.goto('https://www.amazon.com.br/gp/bestsellers');
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('.p13n-sc-uncoverable-faceout .a-link-normal:nth-child(even)');
      
      const postArray = Array.from(postElements).map(post => {
        const title = post.innerText;
        const url = post.href

        return { title, url };
      });

      return postArray.slice(0,3)
    });

    await Promise.all(posts.map(async el => {
      await ddb.putItem({
        TableName: 'Tabela',
        Item: {
          'id': { S: uuid() },
          'title': { S: el.title },
          'url': { S: el.url },
          date: {S: (new Date()).toLocaleDateString('pt-BR')}
        }
      }).promise();
    }))
  } catch (error) {
    console.log(error)
  } finally { 
    await browser.close();
  }
}

module.exports = {
  handler
}