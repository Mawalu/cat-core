var cjdroute = {};

cjdroute.connect = function (node) {
    cjdroute.connection = require("cjdns-admin").Admin({
        ip: node.adminIp,
        port: node.adminPort,
        password: node.adminPassword
    });
};

cjdroute.ping = function () {
    var channel = cjdroute.connection.ping();
    cjdroute.connection.on(channel, console.log);
};

module.exports = cjdroute;
