import { HasId, Store } from '@raincatcher/store';
import * as Logger from 'bunyan';
import * as express from 'express';
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
  const route = router.route('/');
  log.info('Creating new api mount', { config });
  route.get(function(req, res) {
    console.error('Using filter query', req.params.query);
    if (req.params.query) {
      let query: Object;
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
  });
  route.post(function(req, res) {
    const userToCreate = req.body;
    service.add(userToCreate).then((objects) => res.json(objects));
  });
  return router;
}

export * from './service';
