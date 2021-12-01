const EventEmitter = require('events');
const events = Symbol('eventBus');
class Watcher {

    [events] = new EventEmitter();

    $watch(name, callback) {
        const listener = callback.bind(this);
        this[events].addListener(name, listener);
        return () => {
            this.$unwatch(name, listener);
        };
    }

    $unwatch(name, callback) {
        const eventBus = this[events];
        !name
            ? eventBus.removeAllListeners()
            : callback
                ? eventBus.removeListener(name, callback)
                : eventBus.removeAllListeners(name);
    }
}

const WatcherProxy = new Proxy(Watcher, {
    construct: function (target, argumentsList, newTarget) {
        const obj = Reflect.construct(target, argumentsList, newTarget);
        const newObj = new Proxy(obj, {
            get: function (target, property, receiver) {
                return Reflect.get(target, property, receiver);
            },
            set(target, property, value) {
                const newValue = value;
                const oldValue = target[property];
                target[events].emit(property, newValue, oldValue);
                return Reflect.set(...arguments);
            },
        });

        return newObj;
    },
});

module.exports = WatcherProxy;