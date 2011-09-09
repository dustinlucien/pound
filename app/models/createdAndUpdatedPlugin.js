module.exports = exports = function createdAndUpdated (schema, options) {
	schema.add({ created: {type : Date, default: Date.now });
  schema.add({ updated: Date });

  schema.pre('save', function (next) {
		if (this.updated == undefined) {
			this.updated = this.created;
		} else {
			this.updated = Date.now;
		}
		next();
  });

  if (options && options.index) {
    schema.path('updated').index(options.index);
		schema.path('created').index(options.index)
  }
}