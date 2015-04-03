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
      async.each(result, function(host, cb) {
        async.parallel([
          function(callback) {
            cjdroute.callAdminWithCallback(cjdroute.connections[host.cjdnsIp].admin,
                'AuthorizedPasswords_list',
                function(res) {
                    sails.log.info(res);
                    cb(null, res);
                });
          },
          function(callback) {

          }
        ], function(err, result) {

        });
      }, function(err) {
        if(err) callback(err);
        callback(null);
      });
    });
  },

  /**
   * Set the online status for a cjdroute node
   *
   * @param {string}    the nodes cjdnsIp
   * @param {boolean}   status
   * @param {function}  callback
   */
  setOnlineStatus: function(node, status, cb) {
    Host.update({cjdnsIp: node}, {status: status}).exec(function(err, result) {
      if(err) return cb(err);
      var instance = cjdroute.connections[node];
      if(instance.online != status) {
        sails.log.debug(node, status);
      }
      instance.online = status;
      cb(null, result);
    });
  },

  /**
   * Setup the connection to all stored cjdroute instances
   *
   * This gets called from `confg/bootstrap.js` when you run `sails lift`
   *
   * @param {Function}  callback
   */
  setupConnections: function(callback) {

    async.waterfall([
      function(cb) {
        Host.find({adapter: 'cjdroute'}).populateAll().exec(function(err,result) {
          if(err) cb(err);
          cb(null, result);
        });
      },
      function(hosts, cb) {
        async.each(hosts, function(host, done) {
          if(cjdroute.connections[host.cjdnsIp]) {
            return done(null)
          }
          cjdroute.connections[host.cjdnsIp] = {
              admin: require('cjdns-admin').Admin({
                        ip: host.adminIp,
                        port: host.adminPort,
                        password: host.adminPassword
                      }),
              timer: setInterval(function(cjdnsIp) {
                        var status
                          , connection = cjdroute.connections[cjdnsIp];

                        if(new Date().getTime() - connection.lastPong.getTime() <= 20000) {
                          status = true;
                        } else {
                          status = false;
                        }

                        sails.log.verbose(cjdnsIp, status);

                        cjdroute.setOnlineStatus(cjdnsIp, status, function(err, r){
                          if(err) throw err
                        });

                        sails.log.verbose(connection);
                        cjdroute.callAdminWithCallback(connection.admin, 'ping', function(respons) {
                          if(respons.data.q == 'pong') {
                            cjdroute.connections[cjdnsIp].lastPong = new Date();
                            sails.log.verbose(cjdnsIp, 'pong');
                          } else {
                            sails.log.debug(cjdnsIp, respons);
                          }
                        });

                      }, 10000, host.cjdnsIp),
              online: false,
              lastPong: new Date()
          };
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
