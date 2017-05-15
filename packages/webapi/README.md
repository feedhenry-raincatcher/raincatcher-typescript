## Express.js based zero code api module

Create fully restfull CRUD api in less than minute;

## How it works

Webapi allows to create CRUD level api using express.
Module allows to provide custom service implementations.
By default service wraps store implementation to provide basic CRUD operations for datastore.

```
Controller <-> Service <->  Store
```

### Usage

New api can be defined by creating new Interface

```
import * as express from 'express';
import Store from '@raincatcher/store';
import webapi, {WebApiConfig, ApiService, StoreApiService}  from '@raincatcher/webapi';

// Define new datatype
interface Workorder {
    id: string
    name: string,
    completed: boolean
}
```

Create new router with CRUD API support.

```
// Creating store
let taskStore = new Store<Workorder>();
// Creating default service that connects directly with store
let taskService = new StoreApiService<Task>(taskStore);
let taskRouter: express.Router = webapi(taskService, config);
router.add("workflows", taskRouter);
```