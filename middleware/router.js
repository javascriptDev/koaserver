"use strict";
const url   = require('url');
const path  = require('path');
const fs    = require('fs');

let cache = {}

module.exports = function*(next) {
    let info         = url.parse(this.req.url, true).pathname.split('/'),
        ctlName      = info[1] || 'index',
        method       = info.length > 3 ? 'rest' : info[2] || '/',
        relativePath = `../controller/${ctlName}`,
        absolutePath = `${path.resolve(__dirname,relativePath)}.js`;

    // delete require default cache
    if (process.env.env == 'dev') {
        for(var i  in require.cache){
            if(i.indexOf('controller')!=-1){
                delete require.cache[i];
            }
        }
    }
    
    if(cache[absolutePath] || fs.existsSync(absolutePath) ){
        !cache[absolutePath] && (cache[absolutePath] = true);
        let controller = require(relativePath);
        yield (controller[method] || notFind)

    }else{
        
        yield next;
    }
}

function *notFind(){
    this.res.end('no handler');   
}
