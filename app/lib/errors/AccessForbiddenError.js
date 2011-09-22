function AccessForbidden(msg){
  this.name = 'AccessForbidden';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

AccessForbidden.prototype.__proto__ = Error.prototype;
