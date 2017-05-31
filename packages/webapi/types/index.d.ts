/// <reference types="express" />
import * as express from 'express';
import { HasId } from '@raincatcher/store';
import { ApiService } from "./service";
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
export declare function loggerMiddleware(req: any, res: any): void;
/**
 * Raincatcher webapi service module
 *
 * Create codeless API using express.js
 *
 * @param store - storage implementation
 * @param config - module configuration
 * @return router - router that can be mounted in top level application
 */
export default function apiModule<T extends HasId>(store: ApiService<T>, config: WebApiConfig): express.Router;
export * from "./service";
