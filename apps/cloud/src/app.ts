// import * as session from 'express-session'
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as moment from 'moment';
import * as morgan from 'morgan';
import * as passport from 'passport';

import Store from '@raincatcher/store';
import userRouterBuilder, { User } from '@raincatcher/user';

import userSeedData from './users';

const userStore = new Store<User>(userSeedData);
const userRouter = userRouterBuilder(userStore);

import ExternalStore from '@external/extending-store';
import messageRouterBuilder, { Message } from '@raincatcher/message';
const messageRouter = messageRouterBuilder(new ExternalStore<Message>());

const app: express.Express = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/messages', messageRouter);

import taskRoute from './api/task';
app.use('/tasks', taskRoute);

import seeFoodRoute from './api/see_food';
app.use('/seefood', seeFoodRoute);

import catRoute from './api/cat';
app.use('/cats', catRoute);

/*
User needs
 Base url : `/api/wfm/[group|user|membership|`

 | resource | method | returns         |
 | -------- | ------ | --------------- |
 | /        | GET    | array of users  |
 | /:id     | GET    | user            |
 | /:id     | PUT    | updated user    |
 | /        | POST   | created user    |
 | /:id     | DELETE | deleted user    |
 */

import userRoute from './api/user';
app.use('/', userRoute);

// Security spike
import securityInit from './passportSecurity';
const secMiddleware = securityInit(app, userStore);
app.use('/apiSecured', secMiddleware, function(req, res) {
    res.json({ message: 'Authenticated response' });
});

// if you enter a invalid endpoint the app will continue to fail with this implemented
/*
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    next(err);
});

let errHandler: express.ErrorRequestHandler;
if (app.get('env') === 'development') {
    errHandler = function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    };
} else {
    // production error handler
    // no stacktraces leaked to user
    errHandler = function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: {},
            message: err.message
        });
    };
}
app.use(errHandler);
*/

export default app;
