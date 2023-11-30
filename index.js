var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

async function handler(){
    const data = await ddb.scan({
        TableName: 'Tabela'
    }).promise()
    const res = {statusCode: 200, body: data.Items}
    console.log(JSON.stringify(res))
    res.body.map(el => console.log(el))
    return res
}

handler()

module.exports = {
    handler
  }