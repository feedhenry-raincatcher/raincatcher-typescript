"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = require("bunyan");
var log = Logger.createLogger({ name: __filename, level: "debug" });
var StoreApiService = (function () {
    function StoreApiService(store) {
        this.store = store;
    }
    ;
    StoreApiService.prototype.list = function () {
        return this.store.list();
    };
    ;
    StoreApiService.prototype.listWithCondition = function (condition, limit) {
        return this.store.list();
    };
    ;
    StoreApiService.prototype.add = function (user) {
        return this.store.add(user);
    };
    ;
    StoreApiService.prototype.reset = function () {
        return this.store.reset();
    };
    return StoreApiService;
}());
exports.StoreApiService = StoreApiService;
