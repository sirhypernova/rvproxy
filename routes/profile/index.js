module.exports = function (app,conf,User) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    // Body Parser
    app.use('/profile',(req,res,next) => {
        res.locals.error = false;
        res.locals.success = false;
        bodyParser.urlencoded({extended: true})(req,res,next);
    });
    
    function get (req,res) {
        res.render('pages/profile',{page: 'Profile'});
    }
    
    function post (req,res) {
        if (req.body.currentpass && req.body.newpass && req.body.confpass) {
            User.get('SELECT * FROM users WHERE id = ?',req.session.user.id).then(u => {
                var user = new User(u);
                user.checkPassword(req.body.currentpass).then(correct => {
                   if (!correct) return res.render('pages/profile',{page: 'Profile', error: 'Incorrect password.'});
                   if (req.body.newpass != req.body.confpass) return res.render('pages/profile',{page: 'Profile', error: 'Passwords do not match.'});
                   user.data.password = req.body.newpass;
                   user.save();
                   return res.render('pages/profile',{page: 'Profile', success: 'Changed password successfully!'});
                });
            });
        } else {
            res.render('pages/profile',{page: 'Profile', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post
    }
}