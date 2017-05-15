// Example shows that modules can be extended now in demo application codebase.
// This example setup Restfull API for tasks backed by application store
// Example proves that we do not need to have separate modules for simple datasets.
import Store from '@raincatcher/store';
// Express.js based out of the box api service
import webapi, {ApiService, StoreApiService, WebApiConfig}  from '@raincatcher/webapi';
import * as express from 'express';

// Define new datatype
interface Task {
    id: string;
    name: string;
    completed: boolean;
}

// Setup configuration
const config: WebApiConfig = {
    limits: true
};

// Create sample data
const sampleTask: Task = {
    id: '1',
    name: 'Make RainCatcher great again',
    completed: false
};

const taskStore = new Store<Task>([sampleTask]);
// This example is simple but it shows alternative way for developers to extend module functionality.
// Service by default wrapes store, but developers can extend store (or just particular methods)
// To provide custome functionality additionally some different store can be injected into implementation.
const taskService = new StoreApiService<Task>(taskStore);
const taskRouter: express.Router = webapi(taskService, config);

export default taskRouter;
