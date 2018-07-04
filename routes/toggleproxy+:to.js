module.exports = function (app,conf,User,proxydb,proxy) {
    function get(req,res) {
        if (proxy.exists(req.params.to)) {
            proxy.stop(req.params.to);
        } else if (proxydb.has(req.params.to)) {
            proxy.create(proxydb.get(req.params.to).from,req.params.to);
        }
        res.redirect('back');
    }
    
    return {
        get: get,
        else: (req,res) => {
            res.send('Invalid Method.');
        }
    };
}