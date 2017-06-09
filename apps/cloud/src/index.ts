import * as http from 'http';
import app from './app';

import Database from './data';

const db = new Database({
  host: 'localhost'
});

function startServer() {
  const server = http.createServer(app);
  server.listen(8001, 'localhost', function() {
  console.log(
`App started at: ${new Date()} on port: 8001, use
curl -H "Content-Type: application/json" -d '{ "userId": "trever", "content": "hello world" }' localhost:8001/messages
to insert a sample message`
  );
  });
}

db.connect().then(startServer);
