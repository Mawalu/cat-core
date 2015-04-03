/**
* Host.js
*
* @description :: Save the servers / cjdns instances we will connect to
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    cjdnsIp: {
      type: 'ip',
      required: true,
      unique: true
    },
    adminIp: {
      type: 'ip'
    },
    adminPassword: {
      type: 'string',
      required: true
    },
    adminPort: {
      type: 'int',
      defaultsTo: 11234
    },
    adapter: {
      type: 'string',
      defaultsTo: 'cjdroute'
    },
    comment: {
      type: 'text'
    },
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    peers: {
      colletion: 'connection',
      via: 'node'
    },
    status: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  beforeCreate: function(values, cb) {
    if(!values.adminIp) values.adminIp = values.cjdnsIp;
    cb();
  }
};

