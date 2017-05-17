import { HasId, Store } from '@raincatcher/store';
import * as Logger from 'bunyan';
import * as express from 'express';
import * as _ from 'lodash';
import { ApiService, StoreApiService } from './service';

const log = Logger.createLogger({ name: __filename, level: 'debug' });

/** WebApi Module configuration  */
export interface WebApiConfig {
  /**
   * Enable results limits interface
   */
  limits: boolean;
}

/**
 * Example of logging middleware that can be used by clients
 */
export function loggerMiddleware(req: any, res: any) {
  log.trace('request payload', {
    body: req.body,
    method: req.method,
    params: req.params,
    uri: req.url
  });
}

const listHandler = function<T extends HasId>(service: ApiService<T>) {
  const handler: express.RequestHandler = function(req, res) {
    if (req.params.query) {
      let query: object;
      try {
        query = JSON.parse(req.params.query);
        log.error('TEST called', query);
        const limit = req.params.limit ? req.params.limit : 10;
        service.listWithCondition(query, limit).then((objects) => res.json(objects));
      } catch (err) {
        log.error('Invalid query', {
          err,
          query: req.params.query
        });
      }
    } else {
      log.debug('List all without query');
      service.list().then((objects) => res.json(objects));
    }
  };
  return handler;
};

/** Specialized request object with populated item */
export interface SinglePopulatedRequest<T extends HasId> extends express.Request {
  item?: T;
}

const getHandler = function<T extends HasId>(service: ApiService<T>) {
  const handler: express.RequestHandler = function(req: SinglePopulatedRequest<T>, res, next) {
    if (req.item) {
      res.json(req.item);
    } else {
      res.status(404);
      next();
    }
  };
  return handler;
};

const populateById = function<T extends HasId>(service: ApiService<T>) {
  const paramHandler: express.RequestParamHandler = function(req: SinglePopulatedRequest<T>, res, next, id: string) {
    service.list().then((items) =>
      _.find(items, (item) => item.id === id))
      .then((item) => req.item = item)
      .then(() => next())
      .catch(next);
  };
  return paramHandler;
};

/**
 * Raincatcher webapi service module
 *
 * Create codeless API using express.js
 *
 * @param service - service implementation
 * @param config - module configuration
 * @return router - router that can be mounted in top level application
 */
export default function apiModule<T extends HasId>(service: ApiService<T>, config: WebApiConfig) {
  const router: express.Router = express.Router();
  log.info('Creating new api mount', { config });

  router.param('id', populateById(service));
  router.get('/:id', getHandler(service));
  router.get('/', listHandler(service));
  router.post('/', function(req, res) {
    const userToCreate = req.body;
    service.add(userToCreate).then((objects) => res.json(objects));
  });
  return router;
}

export * from './service';
