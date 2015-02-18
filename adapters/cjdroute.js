var cjdroute = {};

cjdroute.connect = function (node) {
    cjdroute.connection = require("cjdns-admin").Admin({
        ip: node.adminIp,
        port: node.adminPort,
        password: node.adminPassword
    });
};

cjdroute.setup = function () {
    // load peers
    // init hartbeat checks
};

cjdroute.ping = function () {
    var channel = cjdroute.connection.ping();
    cjdroute.connection.on(channel, console.log);
};

cjdroute.addPeer = function (peer) {
    if( peer.ip ) { // outbound
        var channel = cjdroute.connection.udpInterface.beginConnection(peer);
        cjdroute.connection.once(channel, console.log);
    } else { // inbound
        var channel = cjdroute.connection.authorizedPasswords.add(peer);
        cjdroute.connection.once(channel, console.log);
    }
};

cjdroute.removePeer = function (peer) {
    if( peer.ip ) { // outbound
        // as far as i know, we can't disconnect from peers
    } else { // inbound
        var channel = cjdroute.connection.authorizedPasswords.remove(peer);
        cjdroute.connection.once(channel, console.log);
    }
};

module.exports = cjdroute;
