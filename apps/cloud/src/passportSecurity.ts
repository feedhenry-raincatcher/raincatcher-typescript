import * as express from 'express';
import * as session from 'express-session'
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as passport from 'passport'
import * as passportLocal from 'passport-local'
import Store from '@raincatcher/store';
import userRouterBuilder, { User } from '@raincatcher/user';
import * as _ from 'lodash';

const LocalStrategy = passportLocal.Strategy;

/**
 * Initialize security express middleware
 */
export default function securityInit(app: express.Router, userStore: Store<User>) {
    setupToken(app, userStore);
}

/**
 * Setup single token based authentication
 */
function setupToken(app: express.Router, userStore: Store<User>) {
    app.use(passport.initialize());
    console.info("Token setup called");

    let authLookup = function (username: string, password: string, done: Function) {
        console.info("Lookup called");
        userStore.list().then(function (users: User[]) {
            var found = _.find(users, user => user.name === username);
            // TODO handle errors
            // TODO check password
            done(null, found);
        });
    };

    passport.use(new LocalStrategy(authLookup));
}

/**
 * Setup session based authentication
 */
function setupSession(app: express.Router, userStore: Store<User>) {
    app.use(cookieParser);
    app.use(session({ secret: 'RainCatcher do not have any' }));
    app.use(passport.initialize());
    app.use(passport.session());

    let authLookup = function (username: string, password: string, done: Function) {
        userStore.list().then(function (users: User[]) {
            var found = _.find(users, user => user.name === username);
            // TODO handle errors
            // TODO check password
            done(null, found);
        });
    };

    passport.use(new LocalStrategy(authLookup));

    // Session serialization
    passport.serializeUser(function (user: User, done: Function) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id: any, done: Function) {
        userStore.list().then(function (users: User[]) {
            var found = _.find(users, user => user.id === id);
            // TODO handle errors
            done(null, found);
        });
    });



}


