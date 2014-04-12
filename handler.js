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
    var q, method;
    console.log(req.url);
    method = (req.params.random) ? 'random' : 'find';
    q  = req.params[0] ? { id:  req.params[0] } : {};
    db[method](q).then(
        function(docs){
            res.send(200, new WrappedResponse(docs));
        },
        function(err){ console.log(err); }
    );
};

handler.thought.put = function(req,res){
    // db.putAThought(res.);
    res.send(404);
};

module.exports = handler;