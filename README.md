<!--
title: 'Srapper API'
description: 'Scraping service for most purchased items from the Amazon website '
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/yasmjm'
authorName: 'Yasmim'
-->


# Srapper API
Para iniciar o desenvolvimento do serviço foi necessário configurar as crendencias AWS com o serverless, seguido da criaçao de duas lambda functions:

1. Um crawler para fazer o scraper e obter os três produtos da página da Amazon e salvar no Dynamodb
2. Um http endpoint que irá retornar esses produtos via REST oriundos do Dynamodb 

# Links úteis 

Como configurar suas credenciais da AWS com o Serverless Framework:
https://www.serverless.com/framework/docs/providers/aws/guide/credentials 

Pra criar o crawler:
https://www.serverless.com/examples/aws-node-puppeteer 
* Um artigo sobre executar lambda functions com puppeteer: 
https://dev.to/alissonb13/web-scraping-serverless-node-js-e-puppeteer-3kp4

Repo com todos os códigos de exemplo
https://github.com/serverless/examples/tree/v3 

Uma API rest com node.js e typescript:
https://www.serverless.com/examples/aws-node-rest-api-typescript
https://github.com/serverless/examples/blob/master/aws-node-rest-api-typescript/app/handler.ts 


## Usage
O sistema salva todos os produtos diariamente às 15:10. Os dados salvos estão disponíveis em tipo Json através do link:
  https://scv0micak4.execute-api.us-east-1.amazonaws.com/dev/scraper

  
### Deployment

Para iniciar o deploy rode o comando abaixo:
```
$ serverless deploy
```


Depois de iniciar o deploy você verá algumas mensagens similares a essas:

```bash
Deploying aws-node-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  hello: aws-node-project-dev-hello (1.5 kB)
```


# Authentication
Para acessar o serviço locamente você precisará configurar as credenciais da AWS na sua máquina 

# Endpoint
- Lista de produtos
GET:
https://scv0micak4.execute-api.us-east-1.amazonaws.com/dev/scraper

# Local development
- Copie o repositório localmente com comando: `git clone https://github.com/yasmjm/scraperApi.git` 
- Mude para branch de desenvolvimento:`git checkout development`
- Agora é necessário instalar as dependências do projetos com o comando: `npm install`
- Para rodar o projeto execute o comando: `npm run dev`
- Após rodar o último comando os resultados serão exibidos no terminal  