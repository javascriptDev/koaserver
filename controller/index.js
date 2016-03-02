"use strict";

const fetch = require('../middleware/fetch');

module.exports = {
	'/':function*(){	

		var php = {
			'a' : 'http://m.baidu.com/news?tn=bdapibaiyue&t=setuserdata'
		}

		let data = yield fetch.get(php);

		yield this.render('index',{
			css:['css/index.css'],
			js:['js/page/index.js']
		});
	},
	'main':function*(){
		
	},
	rest:function*(){

	}
}

