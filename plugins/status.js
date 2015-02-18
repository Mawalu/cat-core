var status = { };

status.init = function(db, cjdns, router) {
    router.get('/status', function(req, res) {
        res.json({ status: "succes", data: 'api is working' });
    });

    console.log("Loaded test plugin from test.js");
};

module.exports = status;
