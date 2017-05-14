import * as express from 'express';
//import * as session from 'express-session'
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as moment from 'moment';
import * as morgan from 'morgan';
import * as passport from 'passport'

import userRouterBuilder, { User } from '@raincatcher/user';
import Store from '@raincatcher/store';
const userSeedData: User[] = require('./users.json');
const userStore = new Store<User>(userSeedData);
const userRouter = userRouterBuilder(userStore);

import messageRouterBuilder, { Message } from '@raincatcher/message';
import ExternalStore from '@external/extending-store';
const messageRouter = messageRouterBuilder(new ExternalStore<Message>());

const app: express.Express = express();

app.use(morgan('dev'));
app.use(cors());
// Using a body parser for JSON requests.
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser);
//app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/messages', messageRouter);

import taskRoute from "./api/task"
app.use('/tasks', taskRoute);


// Security spike
import securityInit from "./passportSecurity";
securityInit(app, userStore);
app.use('/tasksSecured', passport.authenticate('local', { session: false }), taskRoute);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    next(err);
});

let errHandler: express.ErrorRequestHandler;
if (app.get('env') === 'development') {
    errHandler = function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    };
} else {
    // production error handler
    // no stacktraces leaked to user
    errHandler = function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
}
app.use(errHandler);

export default app;
