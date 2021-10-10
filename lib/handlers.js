const pineapple = require('../modules/pineapple');

const handlers = {};

handlers.index = function (data, callback) {
    if (data.method === 'get') {
        callback(200, { status: 'ok' }, 'json');
    } else {
        callback(400, undefined, 'html');
    }
};

handlers.methods = function (data, callback) {
    const acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        pineapple[data.method](data, callback);
    } else {
        callback(
            405,
            { statis: '405', messages: 'Method Not Allowed' },
            'json',
        );
    }
};

handlers.ping = function (data, callback) {
    callback(200, 'pong', 'plain');
};

handlers.notFound = function (data, callback) {
    callback(404, { status: '404', messages: 'Not Found' }, 'json');
};

module.exports = handlers;
