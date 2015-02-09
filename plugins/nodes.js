var uuid = require('uuid');

nodes = {};

nodes.init = function(db, cjdns, router) {
    nodes.db = db;
    nodes.cjdns = cjdns; 

    router.route('/nodes')
        .post(nodes.newNode);
    console.log('Loaded node management plugin');
}

nodes.newNode = function(req, res) {
    var id = uuid.v4();

    nodes.db('nodes').push({ id: id,
                             cjdnsIp: req.body.cjdnsIp,
                             adminPassword: req.body.adminPassword,
                             adminPort: req.body.adminPort,
                             adapter: req.body.adapter,
                             comment: req.body.comment,
                             name: req.body.name }).id;

    res.json({status: "succes", data: {id: id}});
}

module.exports = nodes;
