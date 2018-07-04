module.exports = function (app,conf,User,proxydb,proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    app.use('/new',bodyParser.urlencoded({extended: true}));
    
    function get (req,res) {
        res.render('pages/new',{page: 'New Proxy',error: false}); 
    }
    
    function post (req,res) {
        if (req.body.from && req.body.to) {
                if (isNaN(req.body.from) || isNaN(req.body.to)) return res.render('pages/new',{page: 'New Proxy', error: 'Invalid `from` or `to` port!'});
                var from = parseInt(req.body.from);
                var to = parseInt(req.body.to);
                if (from !== Math.round(from) || to !== Math.round(to)) return res.render('pages/new',{page: 'New Proxy', error: 'Invalid `from` or `to` port!'});
                if (proxydb.has(to.toString())) return res.render('pages/new',{page: 'New Proxy', error: 'A proxy with that port already exists!'});
                proxydb.set(to.toString(),{from:from.toString(),to:to.toString()});
                res.redirect('/');    
        } else {
            res.render('pages/new',{page: 'New Proxy', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post
    }
}