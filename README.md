# raincatcher-typescript
Demo for new raincatcher architecture using typescript and DI.
Repository contains experiments that aren't part of the official RainCatcher solution.
This repository using [Lerna](https://lernajs.io/ to manage independent node.js modules.


## How to run

npm install -g lerna

### Install dependencies
npm install

### Bootstrap application

lerna boostrap

### Running demo cloud

lerna run start --scope=@raincatcher/cloud

## Testing endpoints

### Message create

        curl -H "Content-Type: application/json" -d '{ "userId": "trever", "content": "hello world" }' localhost:8001/messages

### Tasks list

        curl localhost:8001/tasks?query=%7B%22id%3A%221%22%7D&limit=5


### Authentication

        curl -d "apikey=trever" localhost:8001/apiSecured

## Template files
The root [`tslint.json`](./tslint.json) is a template to be included in new modules
