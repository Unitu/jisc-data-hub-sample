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

	var getInstitutions = function(token, callback) {
		request({
			url: 'http://jisc-datahub.azurewebsites.net/api/rest_companies',
			qs: {
				companyType: 'institution',
				access_token: token
			}
		}, function(err, res, body) {
			console.log(err);
			console.log(res);
			console.log(body);
			if (err || res.statusCode != 200) return callback(null);
			callback(JSON.parse(body));
		});
	};

	module.exports = {
		getToken: getToken,
		getInstitutions: getInstitutions
	};

}());
