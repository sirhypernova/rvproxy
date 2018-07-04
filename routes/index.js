module.exports = function (app,conf,User,proxydb,proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    // Body Parser
    app.use((req,res,next) => {
        res.locals.name = conf.name;
        if (req.session.auth) {
            res.locals.user = req.session.user;
            res.locals.proxydb = proxydb;
            res.locals.proxies = proxy;
            res.locals.ip = conf.ip || require("ip").address();
            next();
        } else {
            if (req.path != '/') return res.redirect('/');
            bodyParser.urlencoded({extended: true})(req,res,next);
        }
    });
    
    function get(req,res) {
        if (req.session.auth) {
            res.render('pages/home',{page: 'Home'});
        } else {
            res.render('pages/login',{page: 'Login',error:false});
        }
    }
    
    function post (req, res) {
        if (req.session.auth) {
            res.render('pages/home',{page: 'Home'});
            return;
        }
        if (req.body.username && req.body.password){
            User.get('SELECT * FROM users WHERE username = ?',req.body.username).then(user => {
              if (user != undefined) {
                  bcrypt.compare(req.body.password,user.password).then(correct => {
                      if (correct) {
                          req.session.auth = true;
                          req.session.user = user;
                          res.redirect('back');
                      } else {
                          res.render('pages/login',{page: 'Login', error: 'Incorrect username or password'});
                      }
                  }); 
              } else {
                  res.render('pages/login',{page: 'Login', error: 'Incorrect username or password'});
              }
            });
        } else {
            res.render('pages/login',{page: 'Login', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post,
        else: (req,res) => {
            res.send('Invalid Method.');
        }
    };
}