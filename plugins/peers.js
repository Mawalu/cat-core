peers = {};

peers.init = function(db, cjdns, router) {
    nodes.db = db;
    nodes.cjdns = cjdns; 

    router.route('/peers')
        .get(function(req, res) { // list all peers
            res.json({status: "succes", data: nodes.db('peers').value()})
         })
        .post(function(req, res) { // add new peer
            if(!req.body.name || (!req.body.node && !req.body.group) || !req.body.password 
            || (!req.body.ip && !req.body.cjdnsIp)) {
                return res.json({status: "error", data: {"msg": "parameters missing"}});
            }

            var id = uuid.v4();
            var peer  = { id: id,
                          name: req.body.name,
                          password: req.body.password,
                        }

            if (req.body.node) {
                peer.node = req.body.node;
            } else {
                peer.group = req.body.group;
            }

            if (req.body.ip) {
                peer.ip = req.body.ip
            } else {
                peer.cjdnsIp = req.body.cjdnsIp;
            }

            nodes.db('peers').push(peer);

            res.json({status: "succes", data: {id: id}});
         }); 
    router.route('/peers/:id')
        .get(function(req, res) { // show peer
            var result = db('peers').find({id: req.params.id}).value();

            if(typeof result == "undefined") {
                res.json({status: "error", data: {"msg": "peer not found"}});
            } else {
                res.json({status: "succes", data: result});
            }
        })
        .put(function(req, res) { // update peer
            if(req.params.id) {
                var peer = db('peers').find({id: req.params.id}).assign(req.body).value();
                res.json({status: "succes", data: peer}); 
            }
        })
        .delete(function(req, res) { // delete peer
            db('peers').remove({id: req.params.id});

            res.json({status: "succes", data: ""});
        });

    console.log('Loaded peer management plugin');
}

module.exports = peers;
