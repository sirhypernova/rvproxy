const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const store  = require('connect-sqlite3')(session);
const pcol = require('p-col');
const pcolSQLite = require('pcol-sqlite');
const app = express();

// Config
const port = process.env.PORT || 8080;
const ip = process.env.IP || '0.0.0.0';
const conf = require('./config');

// Proxy
const proxydb = new pcol(new pcolSQLite('db/proxy.db'));
const proxy = require('./proxy');

// Express Setup
app.set('view engine', 'ejs');
app.use(helmet());
app.use(session({
    store: new store({
        db: 'db/session.db'
    }),
    name: 'rvproxy',
    resave: true,
    saveUninitialized: false,
    secret: '9776623437345552965620060357043364012408'
}));

require('./authdb')(conf).then(async (user) => {
    await proxydb.defer();
    await require('./routes')(app,conf,user,proxydb,proxy)('routes');
    console.log('Loaded routes successfully.');
    
    app.use((req,res) => {
       res.render('pages/404',{page: '404'});
    }); 
    
    app.use(express.static('static'));
    
    app.listen(port,ip,() => console.log(`Listening on ${ip}:${port}`));
})
