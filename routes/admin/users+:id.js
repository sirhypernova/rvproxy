module.exports = function (app,conf,User,proxydb,proxy) {
    const bcrypt = require('bcrypt');
    
    function get (req,res) {
        User.get('SELECT * FROM users WHERE id = ?',req.params.id).then(user => {
            if (user != undefined) {
                res.render('pages/admin/users',{page: 'User', u: user});
            } else {
                res.render('pages/admin/users',{page: 'User', u: false});
            }
        });
    }
    
    function post (req,res) {
        User.get('SELECT * FROM users WHERE id = ?',req.params.id).then(u => {
            if (u != undefined) {
                if (req.body.newpass || req.body.username) {
                   var nohash = false;
                   if (req.body.newpass) u.password = req.body.newpass; else nohash = true;
                   if (req.body.username && req.body.username != u.username) {
                       User.get('SELECT id FROM users WHERE username = ?',req.body.username).then(ou => {
                           if (ou != undefined) {
                               res.render('pages/admin/users',{page: 'User', error: 'A user with that username already exists!', u: u});
                           } else {
                               if (req.body.username) u.username = req.body.username;
                               if (req.body.admin && req.body.admin == 'on') u.admin = 1; else u.admin = 0;
                               var user = new User(u,nohash);
                               user.save();
                               if (u.id == req.session.user.id) {
                                   req.session.user = u;
                                   return res.render('pages/admin/users',{page: 'User', success: 'Changed account information successfully!', u: u, user: u});
                               } else {
                                   return res.render('pages/admin/users',{page: 'User', success: 'Changed account information successfully!', u: u});
                               }
                           }
                       });
                   } else {
                       if (req.body.admin && req.body.admin == 'on') u.admin = 1; else u.admin = 0;
                       var user = new User(u,nohash);
                       user.save();
                       if (u.id == req.session.user.id) {
                           req.session.user = u;
                           return res.render('pages/admin/users',{page: 'User', success: 'Changed account information successfully!', u: u, user: u});
                       } else {
                           return res.render('pages/admin/users',{page: 'User', success: 'Changed account information successfully!', u: u});
                       }
                   }
                } else {
                    res.render('pages/admin/users',{page: 'User', error: 'Missing one or more parameters.', u: u});
                }
            } else {
                res.render('pages/admin/users',{page: 'User', error: 'That user could not be found.', u: false});
            }
        });
    }
    
    return {
        get: get,
        post: post
    }
}