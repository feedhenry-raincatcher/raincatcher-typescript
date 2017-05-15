"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Logger = require("bunyan");
var log = Logger.createLogger({ name: __filename, level: "debug" });
/**
 * Example of logging middleware that can be used by clients
 */
function loggerMiddleware(req, res) {
    log.trace("request payload", {
        method: req.method,
        uri: req.url,
        params: req.params,
        body: req.body
    });
}
exports.loggerMiddleware = loggerMiddleware;
;
/**
 * Raincatcher webapi service module
 *
 * Create codeless API using express.js
 *
 * @param store - storage implementation
 * @param config - module configuration
 * @return router - router that can be mounted in top level application
 */
function apiModule(store, config) {
    var router = express.Router();
    var route = router.route('/');
    log.info("Creating new api mount", { config: config });
    route.get(function (req, res) {
        if (req.params.query) {
            log.debug("Using filter query", req.params.query);
            var query = void 0;
            try {
                query = JSON.parse(req.params.query);
            }
            catch (err) {
                log.error("Invalid query", {
                    query: req.params.query,
                    err: err
                });
            }
            var limit = req.params.limit ? req.params.limit : 10;
            store.listWithCondition(query, limit).then(function (objects) { return res.json(objects); });
        }
        else {
            log.debug("List all without query");
            store.list().then(function (objects) { return res.json(objects); });
        }
    });
    route.post(function (req, res) {
        var userToCreate = req.body;
        store.add(userToCreate).then(function (objects) { return res.json(objects); });
    });
    return router;
}
exports.default = apiModule;
;
__export(require("./service"));
