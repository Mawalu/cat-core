var m = { };

m.init = function(db, cjdns, router) {
    router.get('/_ping', function(req, res) {
        res.json({ status: "succes", "error": null, data: 'api is working' });
    });

    console.log("Loaded test plugin from test.js");
};

module.exports = m;
