module.exports = function (app,conf,User,proxydb,proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    // Body Parser
    app.use('/admin',(req,res,next) => {
        if (!req.session.user.admin) return res.redirect('/');
        res.locals.error = false;
        res.locals.success = false;
        bodyParser.urlencoded({extended: true})(req,res,next);
    });
    
    function get (req,res) {
        User.all('SELECT * FROM users').then(us => {
            res.render('pages/admin',{page: 'Admin', users: us}); 
        });
    }
    
    return {
        get: get,
    }
}