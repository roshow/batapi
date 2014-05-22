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
    var q, method;
    method = (req.params.random) ? 'random' : 'find';
    q  = req.params[0] ? { id:  req.params[0] } : {};
    db[method](q).then(
        function(docs){
            res.send(200, new WrappedResponse(docs));
        },
        function(err){ console.log(err); }
    );
};

handler.thought.post = function(req,res){
    console.log(req.params);
    console.log('post to ' + req.url);
    db.putAThought(req.params.docs[0]).then(
        function(savedThought){
            console.log(savedThought);
            res.send(200, new WrappedResponse([savedThought]));
        }
    );
};

module.exports = handler;