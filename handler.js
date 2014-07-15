/*globals require, process, console */
'use strict';

var db = require('./db'),
    handler = {
        connectDb: db.connect,
        thought: {}
    },
    ftp = require('ftp'),
    batFtp = new ftp();

batFtp.connect({
    host: 'roshow.net',
    user: process.env.FTPUSER,
    password: process.env.FTPPW
});


function WrappedResponse(docs){
    this.code = 200;
    this.count = docs.length;
    this.docs = docs;
}

handler.thought.get = function(req, res, next){
    console.log('get to ' + req.url);
    var q = {},
        method;
    method = (req.params.random) ? 'random' : 'find';
    if (req.params.id){
        var key = req.params.id.length > 5 ? '_id' : 'id';
        q[key]= req.params.id;
    }
    console.log(q);
    db[method](q).then(
        function(docs){
            res.send(200, new WrappedResponse(docs));
            return next();
        },
        function(err){ console.log(err); }
    );
};

handler.thought.post = function(req,res, next){
    console.log('post to ' + req.url);
    var thought = req.params.docs ? req.params.docs[0] : req.params;
    db.putAThought(thought).then(
        function(savedThought){
            res.send(200, new WrappedResponse([savedThought]));
            return next();
        }
    );
};

handler.thought.uploadImg = function(req, res, next){
    console.log('uploadImg to ' + req.url);

    var fs = require('fs'),
        filename = Object.keys(req.files)[0];

    fs.readFile(req.files[filename].path, function (err, data) {
        batFtp.put(data, 'public/images/thinkbatman/' + filename, function(err) {
            if (err) {
                console.log(err);
            }
            res.send(200, new WrappedResponse([filename]));
            return next();
        });
        // var newPath = __dirname + "/uploads/uploadedFileName";
        // fs.writeFile('/Users/roshow/github/BatAPI/'+filename, data, function () {
        //     console.log(arguments);
        // });
    });
};

module.exports = handler;