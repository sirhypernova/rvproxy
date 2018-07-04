const bcrypt = require('bcrypt');
const deasync = require('deasync');
const hash = deasync(bcrypt.hash);

module.exports = class User {
    constructor(data,nohash) {
        this.data = data;
        this.nohash = nohash || false;
    }
    
    deserialize(row) {
        return row;
    }
    
    checkPassword(password) {
        return new Promise((resolve,reject) => {
            bcrypt.compare(password,this.data.password).then(correct => {
               resolve(correct);
            });
        })
    }
    
    serialize() {
        var data = this.data;
        if (data.password && !this.nohash) {
            data.password = hash(this.data.password,10);
        }
        return data;
    }
}