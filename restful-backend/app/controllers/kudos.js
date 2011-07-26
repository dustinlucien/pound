//GET /kudos  ->  index
exports.index = function(req, res) {
	res.send('listing kudos');
};

//POST /kudos/create -> new
exports.create = function(req, res) {
	res.send('creating a kudos');
}

//GET /kudos/:kudo -> show
exports.show = function(req, res) {
	res.send('showing kudo ' + req.param.kudo);
}

//PUT /kudos/:kudo -> update
exports.update = function(req, res) {
	res.send('updating the kudo ' + req.params.kudo);
}

//DELETE /kudos/:kudo -> delete
exports.destroy = function(req, res) {
	res.send('destroying kudo ' + req.params.kudo);
}

