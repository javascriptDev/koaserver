"use strict";
var timeout = 1000;
var http    = require('http');
var url     = require('url');
var https   =require('https');

module.exports.get= function*(data) {
    "use strict";
    var promise = [];
    
    for (let key in data) {

        promise.push(
            new Promise((resolve, reject) => {
                var req = http.get(data[key], (res) => {
                        res.setEncoding('utf8');
                        var data = '';
                        res.on('data', (chunk) => {
                          data += chunk;
                        });
                        res.on('end', () => {
                            var result = {};
                            result[key] = data;
                            resolve(result);
                        })
                    })
                req.on('error',(err)=>{
                    reject(err.message);
                })
            })
        )
    }
        

    return yield Promise.all(promise).then((data) => {
            var result = {};
            try{
                data.forEach(item => {
                    for (var d in item) {
                        result[d] = JSON.parse(item[d]);
                    }
                })
                return result;
            }catch(e){
                return e.message;
            }
        
    }).catch((re) => {
        return re;
    });
}

module.exports.post = function*(uri,useHttps){
    let body = url.parse(uri);

    new new Promise((resolve,reject) => {
          let req =  useHttps ? https : http.request({
                method:'POST',
                host:body.host,
                path:body.path
            },(res){
                var data = '';
                res.on('data', function (chunk) {
                    data +=chunk;
                  });
                  res.on('end', function() {
                    resolve(data);
                  })
            })

            req.on('error', function(e) {
              console.log(reject(e.message));
            });



        }).then(data => {
            return data;
        }).catch(error => {
            return error
        })
}