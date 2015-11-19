'use strict';

const internals = {};


const register = function (server, options, next) {

    server.dependency('nes', internals.after.bind(null, options));

    return next();
};


internals.after = (options, server, next) => {

    server.route({
        method: 'GET',
        path: '/vote',
        config: {
            description: 'vote plugin',
            handler: internals.handler
        }
    });

    return next();
};


internals.handler = (request, reply) => {

    return reply('world');
};


register.attributes = {
    name: 'vote',
    version: '1.0.0'
};

export {register as register};
