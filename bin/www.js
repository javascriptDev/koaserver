"use strict";

const numCPUs 	= require('os').cpus().length / 2;
const cluster 	= require('cluster');
const app       = require('../app');


if (cluster.isMaster) {
	for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

     cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
     });
} else {
	app.listen(process.env.srvPorts || 3000);
}