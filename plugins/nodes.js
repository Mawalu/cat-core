var uuid = require('uuid');

nodes = {};

nodes.init = function(db, cjdns, router) {
    nodes.db = db;
    nodes.cjdns = cjdns; 

    router.route('/nodes')
        .get(function(req, res) {
            res.json({status: "succes", data: nodes.db('nodes').value()})
         })
        .post(nodes.newNode);

    router.route('/nodes/:id')
        .get(function(req, res) {
            var result = db('nodes').find({id: req.params.id}).value();

            if(typeof result == "undefined") {
                res.json({status: "error", data: {"msg": "node not found"}});
            } else {
                res.json({status: "succes", data: result});
            }
        })
        .put(function(req, res) {
            if(req.params.id) {
                var node = db('nodes').find({id: req.params.id}).assign(req.body).value();
                res.json({status: "succes", data: node}); 
            }
        })
        .delete(function(req, res) {
            db('nodes').remove({id: req.params.id});

            res.json({status: "succes", data: ""});
        });

    console.log('Loaded node management plugin');
}

nodes.newNode = function(req, res) {
    if(!req.body.cjdnsIp || !req.body.adminPassword || !req.body.adminPort || !req.body.adapter) {
        return res.json({status: "error", data: {"msg": "parameters missing"}});
    }

    var id = uuid.v4();

    nodes.db('nodes').push({ id: id,
                             cjdnsIp: req.body.cjdnsIp,
                             adminPassword: req.body.adminPassword,
                             adminPort: req.body.adminPort,
                             adapter: req.body.adapter,
                             comment: req.body.comment,
                             name: req.body.name }).id;

    return res.json({status: "succes", data: {id: id}});
}

module.exports = nodes;
