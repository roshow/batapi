/*globals require, console, process */
'use strict';

var restify = require('restify'),
    handler = require('./handler'),
    server = restify.createServer({ name: 'thinkbatman' }),
    port = process.env.PORT || 5000,
    routes;

routes = [
    {
        path: ['/thought', '/thought/:id'],
        action: handler.thought.get,
        method: 'get'
    }
];
    
function startServer(rts){
    server
        .use(restify.queryParser())
        .use(restify.bodyParser())
        .use(restify.fullResponse());


    rts.forEach(function(route){
        if (!Array.isArray(route.action)){
            route.action = [route.action];
        }
        if (Array.isArray(route.path)){
            route.path.forEach(function(path){
                server[route.method].apply(server, [path].concat(route.action));
            });
        }
        else {
            server[route.method].apply(server, [route.path].concat(route.action));
        }
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

handler.connectDb().then(function (){
    startServer(routes);
});
// module.exports = handler.connectDb().then(startServer);

