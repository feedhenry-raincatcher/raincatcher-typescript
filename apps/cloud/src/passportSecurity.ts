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

function passwordCheck(userStore: Store<User>): passportLocal.VerifyFunction {
    return function(username, password, done) {
        userStore.list().then(function (users: User[]) {
            var found = _.find(users, user => user.name === username);
            // TODO handle errors
            // TODO check password
            done(null, found);
        })
        .catch(done);
    }
}

/**
 * Setup single token based authentication
 */
function setupToken(app: express.Router, userStore: Store<User>) {
    app.use(passport.initialize());
    console.info("Token setup called");

    passport.use(new LocalStrategy(passwordCheck(userStore)));
}


/**
 * Setup session based authentication
 */
function setupSession(app: express.Router, userStore: Store<User>) {
    app.use(cookieParser);
    app.use(session({ secret: 'RainCatcher do not have any' }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(passwordCheck(userStore)));

    // Session serialization
    passport.serializeUser<User, string>(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser<User, string>(function (id, done) {
        userStore.list().filter<User>(u => u.id === id)
            .then(_.first)
            .then(u => done(null, u))
            .catch(done)
    });
}
