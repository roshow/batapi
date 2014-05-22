'use strict';
var restify = require('restify'),
    handler = require('./handler'),
    server = restify.createServer({ name: 'thinkbatman' }),
    port = process.env.PORT || 7777,
    routes;

routes = [
    {
        path:/^\/(?:bat-|)thought(?:\/(.*)|)$/,
        action: handler.thought.get,
        method: 'get'
    },
    {
        path:'/thought',
        action: handler.thought.post,
        method: 'post'
    },
    {
        path:'/thought/:id',
        action: handler.thought.post,
        method: 'post'
    }
];
    
function startServer(){
    server
        .use(restify.queryParser())
        .use(restify.bodyParser())
        .use(restify.CORS( {origins: ['*']}))
        .use(restify.fullResponse());


    routes.forEach(function(route){
        server[route.method](route.path, route.action);
    });

    server.get(/.*/, restify.serveStatic({
        'directory': './app',
        'default': 'index.html'
    }));

    server.listen(port, function(){
        console.log('%s listening at %s', server.name, server.url);
    });
    // return server;
}

handler.connectDb().then(startServer);
// module.exports = handler.connectDb().then(startServer);

