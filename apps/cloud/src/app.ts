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

import userRoute from './api/user';
app.use('/', userRoute);

// Security spike
import securityInit from './passportSecurity';
const secMiddleware = securityInit(app, userStore);
app.use('/apiSecured', secMiddleware, function(req, res) {
    res.json({ message: 'Authenticated response' });
});


export default app;
