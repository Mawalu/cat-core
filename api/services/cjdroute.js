/**
 * cjdroute.js
 *
 * @description :: A service to communicate with the cjdroute admin api
 * @docs        :: https://www.npmjs.com/package/cjdns-admin
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Services
 */

cjdroute = {

  connections: {},

  /**
   * Call a cjdns admin function and call a callback
   *
   * @param {Object}    connection
   * @param {String}    method
   * @param {Functio}   callback
   */
  callAdminWithCallback: function(connection, method, callback) {
    var channel = connection[method]();
    connection.on(channel, callback);
  },

  /**
   * Sync the cjdroute instances with the data from our database
   *
   * This gets called every time a connection is add / removed / modified
   *
   * @param {Function}  callback
   */
  syncAuthorizedPasswords: function(callback) {
    Host.find({adapter: 'cjdroute'}).populateAll().exec(function(err,result) {
      if(err) throw err;
      async.map(result, function(host, cb) {
        cjdroute.callAdminWithCallback(cjdroute.connections[host.cjdnsIp],
                'AuthorizedPasswords_list',
                function(res) {
                    cb(null, res);
                });
      }, function(err, result) {
        if(err) callback(err);
        callback(result);
      });
    });
  },

  /**
   * Setup the connection to all stored cjdroute instances
   *
   * This gets called from `confg/bootstrap.js` when you run `sails lift`
   *
   * @param {Function}  callback
   */
  setup: function(callback) {

    async.waterfall([
      function(cb) {
        Host.find({adapter: 'cjdroute'}).populateAll().exec(function(err,result) {
          if(err) cb(err);
          cb(null, result);
        });
      },
      function(hosts, cb) {
        async.each(hosts, function(host, done) {
          cjdroute.connections[host.cjdnsIp] = require('cjdns-admin').Admin(
                      {
                        ip: host.adminIp,
                        port: host.adminPort,
                        password: host.adminPassword
                      });
          done(null);
        }, function(err) {
            if(err) cb(err);
            sails.log.verbose(cjdroute.hosts)
            cb(null);
        });
      }
    ], function(err, result) {
      if(err) callback(err);
      sails.log.verbose(cjdroute.connections);
      callback(null);
    });
  }
}


module.exports = cjdroute;
