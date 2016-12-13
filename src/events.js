var eventEmitter = new (require('events').EventEmitter)();

function emitEvent(str) {
    'use strict';
    eventEmitter.emit(str);
}

function registerEvent(str, callback) {
    'use strict';
    eventEmitter.on(str, callback);
}

function registerEventOnce(str, callback) {
    'use strict';
    eventEmitter.once(str, callback);
}

exports.emitEvent = emitEvent;
exports.registerEvent = registerEvent;
exports.registerEventOnce = registerEventOnce;
