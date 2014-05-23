'use strict';
var db = require('./db'),
    handler = {
        connectDb: db.connect,
        thought: {}
    };

function WrappedResponse(docs){
    this.code = 200;
    this.count = docs.length;
    this.docs = docs;
}

handler.thought.get = function(req, res){
    console.log('get to ' + req.url);
    var q = {},
        method;
    method = (req.params.random) ? 'random' : 'find';
    if (req.params.id){
        var key = req.params.id.length > 5 ? '_id' : 'id';
        q[key]= req.params.id;
    }
    db[method](q).then(
        function(docs){
            res.send(200, new WrappedResponse(docs));
        },
        function(err){ console.log(err); }
    );
};

handler.thought.post = function(req,res){
    console.log('post to ' + req.url);
    var thought = req.params.docs ? req.params.docs[0] : req.params;
    db.putAThought(thought).then(
        function(savedThought){
            res.send(200, new WrappedResponse([savedThought]));
        }
    );

};

handler.thought.uploadImg = function(req, res){
    console.log('uploadImg to ' + req.url);
    var fs = require('fs'),
        filename = Object.keys(req.files)[0];
    fs.readFile(req.files[filename].path, function (err, data) {
        // var newPath = __dirname + "/uploads/uploadedFileName";
        fs.writeFile('/Users/roshow/github/BatAPI/'+filename, data, function () {
            console.log(arguments);
        });
    });
};

module.exports = handler;