(function () {

	var request = require('request');

	var getToken = function (email, password, callback) {
		var data = {form: {username: email, password: password}};
		request.post('http://jisc-datahub.azurewebsites.net/login', data, function(err, res, body) {
			if (!err && res.statusCode == 200) {
				body = JSON.parse(body);
				if (body.success) return callback(body.access_token);
			}

			// error fallback
			console.log(err);
			callback(null);
		});
	};

	module.exports = {
		getToken: getToken
	};

}());
