"use strict";

module.exports = {
	"/" : function*(){
			var pageData = {
				css : ["css/a.css"]
			};
			yield this.render("a",pageData)
		}
}