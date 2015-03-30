/**
* Connection.js
*
* @description :: Save inbound and outbound connection details
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    node: {
      model: 'host',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    ip: {
      type: 'ip'
    },
    cjdnsIp: {
      type: 'ip'
    },
    comment: {
      type: 'text'
    },
    status: {
      type: 'string',
      enum: ['up', 'down', 'disabled']
    }
  }
};

