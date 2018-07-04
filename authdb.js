module.exports = function (config) {
    return new Promise((resolve,reject) => {
        const sqlite3 = require('sqlite3po');
        const db = new sqlite3.Database('db/auth.db');
        const User = require('./db/user.js')
        
        db.on('open', async () => {
            await db.bindSchema(User,'users',{id:'INTEGER PRIMARY KEY AUTOINCREMENT',username: 'TEXT',password: 'TEXT',admin: 'INTEGER'});
            User.get('SELECT id FROM users WHERE id = ?',1).then(d => {
                if (d == undefined) {
                    new User({username: 'admin',password: 'admin',admin:true}).save().then(() => {
                        console.log('Initialized Admin account with username and password as admin.');
                    });
                }
            });
            
            resolve(User);
        });
    });
}