const request = require('request');
request.post({
	json:{
		privateCode:'e95835c9d78bab6028b74a67f417c31b',
	},
	url: 'http://localhost:3000/shareFacebook',
},function(error, response, body){
	console.log(JSON.stringify(error));
	console.log(JSON.stringify(response));
	console.log(JSON.stringify(body));
});