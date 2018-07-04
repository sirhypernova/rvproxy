module.exports = function (app,conf,User,proxydb,proxy) {
    return {
        all: (req,res) => {
            User.get('SELECT * FROM users WHERE id = ?',req.params.id).then(user => {
                if (user != undefined) {
                    if (user.admin) return res.redirect('/admin');
                    var u = new User({id:user.id});
                    u.delete();
                    res.redirect('/admin')
                } else {
                    res.redirect('/admin');
                }
            });
        }
    }
}