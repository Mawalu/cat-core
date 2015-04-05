cjdns = {

  nodes: {},

  onlineStatusChanged: function(node, online) {
    sails.log.info(node.cjdnsIp, online); 
  },

  setup: function() {
    Host.find().exec(function(err, hosts) {
      if (err) throw err;
      hosts.forEach(function(host) {
        sails.config.cjdns.adapters[host.adapter].hosts.connect(host, cjdns.onlineStatusChanged, function(err, node){
          cjdns.nodes[node.cjdnsIp] = node; 
        })
      });
    });
  }
}

module.exports = cjdns;
