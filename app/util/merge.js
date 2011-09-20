module.exports = function(a, b) {
	var o = {};
	for (var i in a) {
		o[i] = a[i];
	}
	for (var i in b) {
		o[i] = b[i]; 
	}
	return o;
}

