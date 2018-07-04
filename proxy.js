const express = require('express');
const proxy = require('express-http-proxy');
const isPortAvailable = require('is-port-available');
const session = require('express-session');
const store  = require('connect-sqlite3')(session);
const mainsession = new session({
    store: new store({
        db: 'db/session.db'
    }),
    name: 'rvproxy',
    resave: true,
    saveUninitialized: false,
    secret: '9776623437345552965620060357043364012408'
});

class Proxy {
    constructor() {
        this.proxies = {};
    }
    
    create(fromport,toport) {
            var app = express();
            app.use(mainsession);
            app.use((req,res,next) => {
               if (!req.session.auth) {
                   return res.send('Unauthorized');
               }
               next();
            });
            app.use(proxy('localhost:'+fromport));
            this.proxies[toport] = app.listen(toport);
            this.proxies[toport].on('error',() => {
                delete this.proxies[toport];
            });
    }
    
    stop(key) {
        if (this.exists(key)) {
            this.proxies[key].close();
            delete this.proxies[key];
            return true;
        }
        return false;
    }
    
    exists(key) {
        return key in this.proxies;
    }
}

module.exports = new Proxy;