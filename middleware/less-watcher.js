var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

module.exports =function(watchPath){

    fs.watch(
    watchPath, {
        recursive: true
    },
    function(type, name) {
        var ext = path.extname(name);
        if (type == 'rename') { //删除或者新增或者修改文件名 ps:rename 首先走的删除,之后走的新建
            if (!name) { //删除

            } else { //新增
                if (ext == '.less') {
                    less(`${watchPath}${name}`, `${watchPath}${name.replace(/less/ig, 'css')}`);
                } else if (ext == '') { //在less文件夹下面创建文件夹

                    if (fs.existsSync(`${__dirname}/jsServer/dev/css/${name}`)) {
                        return;
                    } else {
                        exec(`mkdir ${__dirname}/jsServer/dev/css/${name}`);
                    }
                }
            }

            // ph.kill(pids[pids.length-1], false, undefined, function() {
            //     start(JSConfig)
            // });
        } else {
            if (ext == '.less') {
                less(`${watchPath}${name}`, `${watchPath}${name.replace(/less/ig, 'css')}`);

                if (name.indexOf("public") != -1 || name.indexOf("cmp") != -1) {
                    fs.readdirSync(watchPath).map((item) => {
                        path.extname(item) == '.less' && less(watchPath + item, watchPath + item.replace(/less/ig, 'css'))
                    })
                }
            }
        }
    })
}

// 编译less
function less(from, to) {
    exec('lessc ' + from + ' ' + to.replace(/less/ig, 'css')),
        function(err) {

                var writeStream = fs.createWriteStream(__dirname + '/log/less/' + getDate('log-') + '.js', {
                    flags: 'a+'
                });

                writeStream.write(err.toString());
        };
}