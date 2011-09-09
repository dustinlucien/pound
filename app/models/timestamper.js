module.exports = exports = function timestamp(schema, options) {
	schema.add({ created: Date });
  schema.add({ updated: Date });

  schema.pre('save', function (next) {
		var date = Date.now();
		
		if (this.isNew) {
			this.created = date;
		}
		
		this.updated = date;
		
		next();
  });

  if (options && options.index) {
    schema.path('updated').index(options.index);
		schema.path('created').index(options.index)
  }
}