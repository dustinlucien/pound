/**
 * Class def
 */

function KudosController () {
	// no members to set
}

// extend the GenericController class
var GenericController = require( './generic.js' );
KudosController.prototype.__proto__ = GenericController.prototype;

// export the KudosController class
module.exports = KudosController;

/**
 * Class methods
 */

//GET /kudos  ->  index
KudosController.prototype.index = function(req, res) {
	res.send('listing kudos');
};

//POST /kudos/create -> new
KudosController.prototype.create = function(req, res) {
	res.send('creating a kudos');
}

//GET /kudos/:kudo -> show
KudosController.prototype.show = function(req, res) {
	res.send('showing kudo ' + req.param.kudo);
}

//PUT /kudos/:kudo -> update
KudosController.prototype.update = function(req, res) {
	res.send('updating the kudo ' + req.params.kudo);
}

//DELETE /kudos/:kudo -> delete
KudosController.prototype.destroy = function(req, res) {
	res.send('destroying kudo ' + req.params.kudo);
}

