//GET /users  ->  index
exports.index = function(req, res) {
	res.send('listing users');
};

//POST /users/create -> new
exports.create = function(req, res) {
	res.send('creating a user');
}

//GET /users/:user -> show
exports.show = function(req, res) {
	res.send('showing user ' + req.params.user);
}

//PUT /users/:user -> update
exports.update = function(req, res) {
	res.send('updating user ' + req.params.user);
}

//DELETE /users/:user -> delete
exports.destroy = function(req, res) {
	res.send('destroying user ' + req.params.user);
}

