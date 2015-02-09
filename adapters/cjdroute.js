var cjdroute = {};

cjdroute.connect = function (node) {
    this.connection = require("cjdns-admin").Admin({
        ip: node.adminIp,
        port: node.adminPort,
        password: node.adminPassword
    });
};

cjdroute.ping = function () {
    var channel = this.connection.ping();
    this.connection.on(channel, console.log);
};

module.exports = cjdroute;
