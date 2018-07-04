module.exports = function (app,conf,User,proxydb,proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    function get (req,res) {
        res.render('pages/admin/newuser',{page: 'New User', error: false}); 
    }
    
    function post (req,res) {
        if (req.body.username && req.body.password && req.body.confpass) {
               User.get('SELECT id FROM users WHERE username = ?',req.body.username).then(ou => {
                  if (ou == undefined) {
                    if (req.body.password != req.body.confpass) return res.render('pages/admin/newuser',{page: 'New User', error: 'Passwords do not match.'});
                    var u = new User({username: req.body.username,password: req.body.password, admin:req.body.admin && req.body.admin == 'on' ? 1 : 0});
                    u.save();
                    res.redirect('/admin');    
                  } else {
                    res.render('pages/admin/newuser',{page: 'New User', error: 'A user with that username already exists!'});
                  }
               });
        } else {
            res.render('pages/admin/newuser',{page: 'New User', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post
    }
}