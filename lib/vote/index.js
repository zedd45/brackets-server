'use strict';

// Load Modules
import Hoek from 'hoek';
import makeStore from '../store';


const internals = {
    brackets: [
        {
            name: 'Continuous Integration Apps',
            data: require('../../ci-bracket.json')
        },
        {
            name: 'Issue Tracker Apps',
            data: require('../../issue-tracker-bracket.json')
        }
    ]
};


const register = function (server, options, next) {

    server.dependency('nes', internals.after.bind(null, options));

    return next();
};


internals.after = function (options, server, next) {

    // const stores = internals.brackets.map((bracket) => internals.initStore(bracket));

    const stores = internals.initSubscriptionPath('/vote', internals.brackets);

    server.bind({ stores });
    server.subscription('/vote/{id}', { onSubscribe: internals.onSubscribe.bind(null, {server, stores}) });
    server.route({
        method: 'GET',
        path: '/votes',
        config: {
            description: 'vote plugin',
            handler: internals.handler
        }
    });

    return next();
};


internals.onSubscribe = function (self, socket, path) {

    console.log('received subscription from %s for path:', socket.id, path);

    return self.server.publish(path, self.stores[path].data.getState().toJS());
};


internals.initSubscriptionPath = function (pathBase, entry) {

    const subscriptions = {};

    for (let i = 0, il = entry.length; i < il; ++i) {
        let store = entry[i];
        let path = `${pathBase}/${i}`;

        subscriptions[path] = entry[i];
        subscriptions[path].data = internals.initStore(entry[i].data);
        subscriptions[path].path = path;
    }

    return subscriptions;
};


internals.handler = function (request, reply) {

    const resources = [];
    const keys = Object.keys(this.stores);

    for (let i = 0, il = keys.length; i < il; ++i) {
        let value = this.stores[keys[i]];

        resources.push({
            path: value.path,
            name: value.name,
            data: value.data.getState().toJS(),
        });
    }

    return reply(resources);
};


internals.initStore = function (initialState) {

    const store = makeStore();
    store.dispatch({
        type: 'SET_ENTRIES',
        entries: initialState
    });

    store.dispatch({ type: 'NEXT' });

    return store;
};


register.attributes = {
    name: 'vote',
    version: '1.0.0'
};

export {register as register};
