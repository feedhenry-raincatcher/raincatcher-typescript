import Store from '@raincatcher/store';
import userRouterBuilder, { User } from '@raincatcher/user';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import * as _ from 'lodash';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';

const LocalAPIKeyStrategy: any = require('passport-localapikey').Strategy;

const LocalStrategy = passportLocal.Strategy;

/**
 * Initialize security express middleware
 */
export default function securityInit(app: express.Router, userStore: Store<User>): express.Handler {
    return setupToken(app, userStore);

}

function passwordCheck(userStore: Store<User>): passportLocal.VerifyFunction {
    return function(username, password, done) {
        console.error('Password check for ', username);
        userStore.list().then(function(users: User[]) {
            const found = _.find(users, (user) => user.name === username);
            // TODO handle errors
            // TODO check password
            done(null, found);
        }).catch(done);
    };
}

/**
 * Setup single token based authentication
 */
function setupToken(app: express.Router, userStore: Store<User>): express.Handler {
    app.use(cookieParser());
    function strategy(apikey: String, done: any) {
        console.error('Password check for ', apikey);
        userStore.list().then(function(users: User[]) {
            const found = _.find(users, (user) => user.name === apikey);
            // TODO handle errors
            // TODO check password
            done(null, found);
        }).catch(done);
    }

    passport.use(new LocalAPIKeyStrategy(strategy));
    app.use(passport.initialize());
    const passportAuth = passport.authenticate('localapikey', { session: false, failWithError: true });
    return passportAuth;
}

/**
 * Setup session based authentication
 */
function setupSession(app: express.Router, userStore: Store<User>) {
    app.use(cookieParser());
    passport.use(new LocalStrategy(passwordCheck(userStore)));
    app.use(session({ secret: 'RainCatcher do not have any' }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Session serialization
    passport.serializeUser<User, string>(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser<User, string>(function(id, done) {
        userStore.list().filter<User>((u) => u.id === id)
            .then(_.first)
            .then((u) => done(null, u))
            .catch(done);
    });
}
