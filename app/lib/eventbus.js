var EventEmitter = require('events').EventEmitter,
    redis = require('redis');

function EventBus (obj) {
  this.client = null;
};

/**
 * Inherit from EventEmitter.
 */

EventBus.prototype.__proto__ = EventEmitter.prototype;

EventBus.prototype.init = function() {
  this.client = redis.createClient();
};

module.exports = new EventBus();