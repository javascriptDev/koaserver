"use strict";
var fs         = require('fs');
var path       = require('path');
var exec       = require('child_process').exec;

//模式类型 dev or dist
var opearation = process.argv[2];
var type       = process.argv[3];
var name       = process.argv[4];
var addRouter  = process.argv[5] || false;

/*
 * view 构造函数
 */
class View {
    constructor(name) { //构造函数
        this.name 			= name;
        var me 				= this;
        this.viewCode 		= [
                "<% include public/header.html%>",
                "@page",
                "<% include public/js.html%>"
            ].join('\r\n'),
            this.jsCode 	= 'define(function(require){\r\n\r\n\r\n})',
            this.cssCode 	= [].join('\r\n'),
            this.config 	= [{
                    path: './view/@page.html',
                    code: me.viewCode.replace(/@page/ig, name)
                },

                {
                    path: './resource/less/@page.less',
                    code: me.cssCode
                }, {
                    path: './resource/js/page/@page.js',
                    code: me.jsCode
                }
            ],

            this.routerPath = './controller/@page.js'.replace('@page', name),
            this.routerCode = [
                'module.exports = {',
                '	"/":function*(){',
                '			var pageData = {',
                '				css : ["css/@page.css"]',
                '			};',
                '			yield this.render("@page",pageData)',
                '		}',
                '}'
            ].join('\r\n')
    }
    add(isAddCtl) {
        var me = this;
        this.config.forEach((item, index) => {
            var ws = fs.createWriteStream(item.path.replace('@page', me.name));
            ws.write(item.code);
            console.log('create ' + item.path.replace('@page', me.name) + ' success!');
        })
        if (isAddCtl) {
            var ws = fs.createWriteStream(me.routerPath.replace('@page', me.name));
            ws.write(me.routerCode.replace(/@page/ig, me.name));
            console.log('create ' + me.routerPath + ' success!')
        }
    }
    rm(isRmCtl) {
        var me = this;
        this.config.forEach(item => {
            exec('rm -rf ' + item.path.replace('@page', me.name), function(err, stderr, stdout) {
                console.log(stdout);
                err && console.log(err);
            });
        })
        isRmCtl && exec('rm -rf ' + me.routerPath, function(err, stderr, stdout) {
            console.log(stdout);
            err && console.log(err);
        })
    }
}

/*
 * 组件构造函数
 */
class Component {
    constructor(name) {
        this.name = name;
        this.path = './jsServer/dev/js/component/@page.js'.replace(/@page/ig, name);
        this.code = [
            "define('js/component/@name', function(require, exports, module) {",
            "	module.exports = @name;",
            "	function @name(opt) {\r\n",
            "	}",
            "	@name.prototype ={",
            "	}",
            "}"

        ].join('\r\n').replace(/@name/ig, name);
    }
    add() {
        var ws = fs.createWriteStream(this.path);
        ws.write(this.code);
        console.log('create ' + this.path + ' success!');
    }
    rm() {
        exec('rm -rf ' + this.path, function(err, stderr, stdout) {
            console.log(stdout);
            err && console.log(err);
        })
    }
}

//操作工厂
switch (opearation) {
    case 'add':
        if (type == 'view') {
            new View(name).add(addRouter);
        } else if (type == 'cmp') {
            new Component(name).add()
        }
        break;
    case 'rm':
        if (type == 'view') {
            new View(name).rm(addRouter);
        } else if (type == 'cmp') {
            new Component(name).rm()
        }
        break;
    default:
        return;
}