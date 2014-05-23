'use strict';
var restify = require('restify'),
    handler = require('./handler'),
    server = restify.createServer({ name: 'thinkbatman' }),
    port = process.env.PORT || 7777,
    routes;

// var Client = require('ftp');

// var c = new Client();
// c.on('ready', function (){
//     c.list('public/images/thinkbatman', function (err, list){
//         if (err) throw err;
//         console.dir(list);
//         c.end();
//     });
// });

// c.connect({
//     host: 'roshow.net',
//     user: 'roshow@roshow.net',
//     password: 'Websh1t@'
// });


routes = [
    {
        paths: ['/thought', '/thought/:id'],
        action: handler.thought.get,
        method: 'get'
    },
    {
        paths: ['/thought', '/thought/:id'],
        action: handler.thought.post,
        method: 'post'
    },
    {
        path: '/uploadImg',
        action: handler.thought.uploadImg,
        method: 'post'
    }
];
    
function startServer(){
    server
        .use(restify.queryParser())
        .use(restify.bodyParser())
        .use(restify.fullResponse());


    routes.forEach(function(route){
        if (route.paths){
            route.paths.forEach(function(path){
                server[route.method](path, route.action);
            });
        }
        else {
            server[route.method](route.path, route.action);
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

handler.connectDb().then(startServer);
// module.exports = handler.connectDb().then(startServer);

