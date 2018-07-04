module.exports = function (app,conf,User,proxydb,proxy) {
    function get(req,res) {
        if (proxydb.has(req.params.to)) {
            if (proxy.exists(req.params.to)) {
                proxy.stop(req.params.to);
            }
            proxydb.delete(req.params.to);
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