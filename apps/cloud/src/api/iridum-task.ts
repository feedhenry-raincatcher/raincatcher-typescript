import * as express from 'express';
const taskRouter: express.Router = express.Router();

// TODO: actually hook up the Iridium Store
taskRouter.get('/', (req, res) => res.send('hello'));

export default taskRouter;
