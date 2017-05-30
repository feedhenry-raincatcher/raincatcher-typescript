import * as Promise from 'bluebird';
import * as mongoose from 'mongoose';
const label = '[fh-mongoose] ';

const handlers = {
  onError: function(err: Error) {
    console.error(label, err.toString());
  },
  onConnection: function(uri: string) {
    console.info(label, 'Connected to Mongo @', uri);
  },
  onConnectionOpen: function() {
    console.info(label, 'Mongo connection open');
  },
  onClose: function() {
    console.info(label, 'Mongo connection closed');
  }
};

export default class DB {
  connection: mongoose.Connection;
  connectToMongo = function(this: DB, uri: string, opts: mongoose.ConnectionOptions = {}) {
    return new Promise<mongoose.Connection>((resolve, reject) => {
      mongoose.connect(uri, opts);
      const conn = mongoose.connection;
      conn.once('open', () => {
        this.connection = conn;
        handlers.onConnectionOpen();
      }).on('error', function(error: Error) {
        handlers.onError(error);
        reject(error);
      }).on('connected', function() {
        handlers.onConnection(uri);
        resolve(conn);
      });
    });
  };

  getConfig = function(this: DB) {
    let self = this;
    return Promise.resolve(self.connection.config);
  };
  closeConnection = function() {
    let self = this;
    return new Promise(function(resolve) {
      self.connection.close(handlers.onClose);
      resolve(true);
    });
  };
};
