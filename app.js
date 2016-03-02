"use strict";

const koa 		 = require('koa');
const logger 	 = require('koa-log4js');
const bodyparser = require('koa-bodyparser');
const favicon 	 = require('koa-favicon');
const render 	 = require('koa-ejs');
const util 		 = require('util');
const path 		 = require('path');
const serve 	 = require('koa-file-server');
const less 		 = require('./middleware/less-watcher');

let env = process.env;

const config 	 = require('./bin/config')[env.env];
let app 		 = new koa();

//use body parse mw
app.use(bodyparser());

//use log mw
app.use(logger({
	file:`${__dirname}/log/${new Date().getMonth()}-${new Date().getDate()}.log`
}));

//use .ico mw
app.use(favicon(path.resolve(__dirname ,'../resource/images/favicon.ico')));

//use template engine
render(app, {
  root: `${__dirname}/view/`,
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: true
});


// rewrite render
let sysRender = app.context.render;


//use less watcher
env.env == 'dev' && less(`${__dirname}/resource/less/`);

let defaultCfg = {
	js 					:['js/lib/jq.js','js/lib/DI.js'],
	css 				:['css/base.css'],
	header_description 	:'xxx',
	header_keywords		:'xxx',
	header_title		:'yintai'
}

let extendCfg = {
	sysApi 	 	 : env.api || '',
	jsServerAddr : env.jsserver || '/',
	ResVer		 : env.ver || 1	
}

app.context.render = function(view,opt){
	
	return function*(){

		opt.js  	= (opt.js || []).concat(defaultCfg.js);
		opt.css 	= (opt.css || []).concat(defaultCfg.css);
		opt.header_keywords 	= opt.header_keywords || defaultCfg.header_keywords;
		opt.header_title 		= opt.header_title || defaultCfg.header_title;
		opt.header_description 	= opt.header_description || defaultCfg.header_description;

		util._extend(opt,extendCfg);

		yield sysRender.apply(this,[view,opt]);
	}
}

//use router
app.use(require('./middleware/router'));

//use static file server
app.use(serve(`${__dirname}/resource/`));

module.exports = app;